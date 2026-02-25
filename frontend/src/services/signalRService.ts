/**
 * SignalR Service
 * Manages SignalR connection for real-time notifications
 */

import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { API_ENDPOINTS } from "@/api/endpoints";
import { SignalRNotification, NotificationCallback } from "@/types";

// Helper function to get cookie by name
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") {
    return null;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

interface RetryContext {
  previousRetryCount: number;
  elapsedMilliseconds: number;
  retryReason: Error;
}

class SignalRService {
  private connection: HubConnection | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3; // Reduced from 5
  private reconnectDelay: number = 5000; // Increased from 3 seconds
  private callbacks: Map<string, NotificationCallback> = new Map();
  private connectionAttemptInProgress: boolean = false;
  private lastConnectionAttempt: number = 0;
  private connectionCheckInterval: NodeJS.Timeout | null = null;
  private isBackendAvailable: boolean = true;
  private hasLoggedHubUnavailable: boolean = false;

  /**
   * Get the SignalR hub URL
   * @returns Hub URL
   */
  getHubUrl(): string {
    const overrideHubUrl = process.env.NEXT_PUBLIC_SIGNALR_HUB_URL;
    if (overrideHubUrl) {
      return overrideHubUrl;
    }
    const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY || "";
    const hubPath =
      API_ENDPOINTS.COMMUNICATION?.NOTIFICATION_HUB ||
      "/communication-service/hubs/notifications";
    return `${apiGateway}${hubPath}`;
  }

  isRealtimeEnabled(): boolean {
    return process.env.NEXT_PUBLIC_ENABLE_REALTIME === "true";
  }

  /**
   * Get access token from cookie
   * @returns Access token
   */
  getAccessToken(): string | null {
    return getCookie("access_token");
  }

  /**
   * Create and configure SignalR connection
   * @returns SignalR connection
   */
  createConnection(): HubConnection {
    const hubUrl = this.getHubUrl();
    const token = this.getAccessToken();

    console.log("SignalR: Creating connection to:", hubUrl);
    console.log("SignalR: Token available:", !!token);

    if (!token) {
      console.warn("SignalR: No access token found, connection may fail");
    }

    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token || "",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext: RetryContext) => {
          // Exponential backoff: 0s, 2s, 10s, 30s, then 30s
          if (retryContext.previousRetryCount === 0) return 0;
          if (retryContext.previousRetryCount === 1) return 2000;
          if (retryContext.previousRetryCount === 2) return 10000;
          return 30000;
        },
      })
      .configureLogging(LogLevel.None)
      .build();

    // Setup connection event handlers
    connection.onclose((error?: Error) => {
      this.isConnected = false;
      console.log("SignalR: Connection closed", error);

      if (error) {
        console.error("SignalR: Connection closed due to error", error);
      }
    });

    connection.onreconnecting((error?: Error) => {
      this.isConnected = false;
      console.log("SignalR: Reconnecting...", error);
    });

    connection.onreconnected((connectionId?: string) => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      console.log("SignalR: Reconnected with connection ID:", connectionId);
    });

    return connection;
  }

  /**
   * Check if backend is available by making a simple fetch request
   */
  async checkBackendAvailability(): Promise<boolean> {
    const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY || "";
    if (!apiGateway) return false;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${apiGateway}/health`, {
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      console.warn("SignalR: Backend health check failed");
      return false;
    }
  }

  /**
   * Check if SignalR hub negotiate endpoint is reachable
   */
  async checkHubAvailability(): Promise<boolean> {
    const hubUrl = this.getHubUrl();
    const token = this.getAccessToken();
    if (!hubUrl) return false;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`${hubUrl}/negotiate?negotiateVersion=1`, {
        method: "POST",
        signal: controller.signal,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      clearTimeout(timeoutId);

      // 2xx: available, 401/403: reachable but unauthorized, still considered available
      return response.ok || response.status === 401 || response.status === 403;
    } catch {
      return false;
    }
  }

  /**
   * Connect to SignalR hub
   * @returns Promise<void>
   */
  async connect(): Promise<void> {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    if (!this.isRealtimeEnabled()) {
      return;
    }

    if (this.connection && this.isConnected) {
      console.log("SignalR: Already connected");
      return;
    }

    if (this.connectionAttemptInProgress) {
      console.log("SignalR: Connection attempt already in progress, skipping");
      return;
    }

    const now = Date.now();
    const timeSinceLastAttempt = now - this.lastConnectionAttempt;
    if (timeSinceLastAttempt < 5000) {
      console.log(`SignalR: Throttling connection attempt (${Math.round(timeSinceLastAttempt / 1000)}s since last attempt)`);
      return;
    }

    this.connectionAttemptInProgress = true;
    this.lastConnectionAttempt = now;

    try {
      const token = this.getAccessToken();
      if (!token) {
        console.warn("SignalR: No access token found, skipping connection");
        return;
      }

      // Check backend availability first
      if (!this.isBackendAvailable) {
        const isAvailable = await this.checkBackendAvailability();
        if (!isAvailable) {
          console.warn("SignalR: Backend not available, skipping connection");
          return;
        }
        this.isBackendAvailable = true;
      }

      if (!this.connection) {
        const hubAvailable = await this.checkHubAvailability();
        if (!hubAvailable) {
          if (!this.hasLoggedHubUnavailable) {
            console.warn(
              "SignalR: Hub unavailable. Realtime is disabled until hub is reachable."
            );
            this.hasLoggedHubUnavailable = true;
          }
          this.isBackendAvailable = false;
          return;
        }

        this.connection = this.createConnection();
        this.setupNotificationHandler();
      }

      await this.connection.start();
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.isBackendAvailable = true;
      console.log("SignalR: Connected successfully");
    } catch (error) {
      this.isConnected = false;
      const typedError = error as Error;
      console.warn("SignalR: Connection failed", typedError.message);

      const isNegotiationError =
        typedError.message?.includes("negotiation") ||
        typedError.message?.includes("Failed to fetch") ||
        typedError.message?.includes("NetworkError") ||
        typedError.name === "AbortError";

      if (isNegotiationError) {
        this.isBackendAvailable = false;
        console.warn("SignalR: Backend appears unavailable, will retry later");
        return;
      }

      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000);
        console.log(`SignalR: Retrying in ${delay / 1000}s (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        setTimeout(() => {
          this.connectionAttemptInProgress = false;
          this.connect();
        }, delay);
      } else {
        console.warn("SignalR: Max reconnection attempts reached, stopping");
      }
    } finally {
      this.connectionAttemptInProgress = false;
    }
  }

  /**
   * Setup notification handler
   */
  setupNotificationHandler(): void {
    if (!this.connection) return;

    this.connection.on("ReceiveNotification", (notification: SignalRNotification) => {
      console.log("SignalR: Received notification", notification);
      console.log(
        `SignalR: Calling ${this.callbacks.size} registered callbacks`
      );

      // Call all registered callbacks
      let callbackIndex = 0;
      this.callbacks.forEach((callback, key) => {
        try {
          callbackIndex++;
          console.log(
            `SignalR: Calling callback #${callbackIndex} (key: ${key})`
          );
          callback(notification);
        } catch (error) {
          console.error(
            `SignalR: Error in notification callback (key: ${key})`,
            error
          );
        }
      });
    });
  }

  /**
   * Register callback for notifications with a unique key
   * If key already exists, the old callback will be replaced
   * @param key - Unique key for the callback
   * @param callback - Callback function to handle notifications
   * @returns Unsubscribe function
   */
  onNotificationByKey(key: string, callback: NotificationCallback): () => void {
    if (typeof callback !== "function") {
      console.error("SignalR: Callback must be a function");
      return () => {};
    }

    if (!key || typeof key !== "string") {
      console.error("SignalR: Key must be a non-empty string");
      return () => {};
    }

    // If key already exists, replace old callback
    if (this.callbacks.has(key)) {
      console.warn(`SignalR: Replacing existing callback for key: ${key}`);
    }

    this.callbacks.set(key, callback);
    console.log(
      `SignalR: Callback registered with key: ${key}. Total: ${this.callbacks.size}`
    );

    // Return unsubscribe function
    return () => this.offNotificationByKey(key);
  }

  /**
   * Unregister callback by key
   * @param key - Unique key for the callback
   * @returns True if callback was removed, false otherwise
   */
  offNotificationByKey(key: string): boolean {
    if (this.callbacks.has(key)) {
      this.callbacks.delete(key);
      console.log(
        `SignalR: Callback unregistered for key: ${key}. Total: ${this.callbacks.size}`
      );
      return true;
    }
    console.warn(`SignalR: No callback found for key: ${key}`);
    return false;
  }

  /**
   * Register callback for notifications (legacy method for backward compatibility)
   * Generates a random key internally
   * @param callback - Callback function to handle notifications
   * @returns Unsubscribe function
   */
  onNotification(callback: NotificationCallback): () => void {
    // Generate random key for backward compatibility
    const randomKey = `callback_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    return this.onNotificationByKey(randomKey, callback);
  }

  /**
   * Disconnect from SignalR hub
   * @returns Promise<void>
   */
  async disconnect(): Promise<void> {
    if (!this.connection) {
      return;
    }

    try {
      this.callbacks.clear();
      await this.connection.stop();
      this.isConnected = false;
      this.connection = null;
      console.log("SignalR: Disconnected");
    } catch (error) {
      console.error("SignalR: Error disconnecting", error);
      this.connection = null;
      this.isConnected = false;
      this.hasLoggedHubUnavailable = false;
    }
  }

  /**
   * Check if connected
   * @returns boolean
   */
  getConnected(): boolean {
    return (
      this.isConnected &&
      this.connection?.state === HubConnectionState.Connected
    );
  }
}

// Create singleton instance
const signalRService = new SignalRService();

export default signalRService;
