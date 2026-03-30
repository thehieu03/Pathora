"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui";
import { LandingHeader } from "@/features/shared/components/LandingHeader";
import { LandingFooter } from "@/features/shared/components/LandingFooter";
import { useTranslation } from "react-i18next";
import { paymentService, type PaymentTransaction } from "@/api/services/paymentService";
import { handleApiError } from "@/utils/apiResponse";

// QR Code component using img tag for SePay QR URL
function QRCodeDisplay({ url, size = 200 }: { url: string; size?: number }) {
  return (
    <img
      src={url}
      alt="Payment QR Code"
      style={{ width: size, height: size }}
      className="rounded-lg border-2 border-gray-200"
    />
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("vi-VN");
}

type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "expired";

export default function PaymentStatusPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const transactionCode = searchParams.get("code");
  const bookingId = searchParams.get("bookingId");

  const [transaction, setTransaction] = useState<PaymentTransaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<PaymentStatus>("pending");
  const [countdown, setCountdown] = useState<number>(0);

  // Poll for transaction status
  useEffect(() => {
    if (!transactionCode) {
      setError("Missing transaction code");
      setLoading(false);
      return;
    }

    let intervalId: NodeJS.Timeout | null = null;

    const fetchStatus = async () => {
      try {
        const result = await paymentService.getTransaction(transactionCode);
        if (result) {
          setTransaction(result);
          const newStatus = mapStatus(result.status);
          setStatus(newStatus);

          // Update countdown
          if (result.expiredAt) {
            const expired = new Date(result.expiredAt).getTime();
            const now = Date.now();
            const remaining = Math.max(0, Math.floor((expired - now) / 1000));
            setCountdown(remaining);

            if (remaining <= 0 && newStatus === "pending") {
              setStatus("expired");
            }
          }

          // Stop polling if completed or failed
          if (newStatus === "completed" || newStatus === "failed" || newStatus === "expired") {
            if (intervalId) clearInterval(intervalId);
          }
        }
      } catch (err: unknown) {
        const handledError = handleApiError(err);
        console.error("Failed to fetch transaction:", handledError.message);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchStatus();

    // Poll every 5 seconds
    intervalId = setInterval(fetchStatus, 5000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [transactionCode]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0 || status !== "pending") return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setStatus("expired");
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, status]);

  function mapStatus(status: string): PaymentStatus {
    switch (status) {
      case "Completed":
        return "completed";
      case "Processing":
        return "processing";
      case "Failed":
        return "failed";
      case "Cancelled":
        return "expired";
      default:
        return "pending";
    }
  }

  function formatCountdown(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  if (loading) {
    return (
      <>
        <LandingHeader />
        <main className="bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Icon icon="heroicons:arrow-path" className="size-12 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading payment status...</p>
          </div>
        </main>
      </>
    );
  }

  if (error || !transaction) {
    return (
      <>
        <LandingHeader />
        <main className="bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="size-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="heroicons:exclamation-triangle" className="size-8 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Payment Error</h1>
            <p className="text-gray-600 mb-6">{error || "Unable to load transaction"}</p>
            <Link
              href="/home"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
              <Icon icon="heroicons:home" className="size-5" />
              Back to Home
            </Link>
          </div>
        </main>
      </>
    );
  }

  // Success state
  if (status === "completed") {
    return (
      <>
        <LandingHeader />
        <main className="bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="max-w-md mx-auto p-6 text-center">
            <div className="size-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="heroicons:check-circle" className="size-12 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Your payment of {formatCurrency(transaction.paidAmount || transaction.amount)} has been processed.
            </p>

            <div className="bg-white rounded-xl border border-gray-200 p-4 text-left mb-6">
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction Code</span>
                  <span className="font-mono font-medium">{transaction.transactionCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Paid Amount</span>
                  <span className="font-medium text-green-600">{formatCurrency(transaction.paidAmount || transaction.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Time</span>
                  <span>{formatDate(transaction.paidAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {bookingId ? (
                <Link
                  href={`/bookings/${bookingId}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
                  <Icon icon="heroicons:clipboard-document-check" className="size-5" />
                  View Booking
                </Link>
              ) : (
                <Link
                  href="/bookings"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
                  <Icon icon="heroicons:clipboard-document-check" className="size-5" />
                  My Bookings
                </Link>
              )}
            </div>
          </div>
        </main>
        <LandingFooter />
      </>
    );
  }

  // Expired state
  if (status === "expired") {
    return (
      <>
        <LandingHeader />
        <main className="bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="max-w-md mx-auto p-6 text-center">
            <div className="size-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="heroicons:clock" className="size-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Expired</h1>
            <p className="text-gray-600 mb-6">
              The payment window has expired. Please create a new payment to complete your booking.
            </p>

            <div className="flex gap-3">
              <Link
                href="/home"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                Back to Home
              </Link>
              {bookingId && (
                <Link
                  href={`/checkout?bookingId=${bookingId}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
                  Try Again
                </Link>
              )}
            </div>
          </div>
        </main>
        <LandingFooter />
      </>
    );
  }

  // Failed state
  if (status === "failed") {
    return (
      <>
        <LandingHeader />
        <main className="bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="max-w-md mx-auto p-6 text-center">
            <div className="size-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="heroicons:x-circle" className="size-12 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-6">
              There was an issue processing your payment. Please try again.
            </p>

            <div className="flex gap-3">
              <Link
                href="/home"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                Back to Home
              </Link>
              {bookingId && (
                <Link
                  href={`/checkout?bookingId=${bookingId}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
                  Try Again
                </Link>
              )}
            </div>
          </div>
        </main>
        <LandingFooter />
      </>
    );
  }

  // Pending/Processing state - show QR code
  return (
    <>
      <LandingHeader />
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-lg mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Complete Your Payment</h1>
            <p className="text-gray-600 mt-1">
              Scan the QR code below to pay {formatCurrency(transaction.amount)}
            </p>
          </div>

          {/* Transaction Info Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <div className="p-5">
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction Code</span>
                  <span className="font-mono font-medium">{transaction.transactionCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-bold text-orange-600">{formatCurrency(transaction.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Content</span>
                  <span className="font-medium">{transaction.paymentNote}</span>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <div className="p-6 text-center">
              {transaction.qrCodeUrl ? (
                <QRCodeDisplay url={transaction.qrCodeUrl} size={220} />
              ) : (
                <div className="size-[220px] bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                  <Icon icon="heroicons:qr-code" className="size-16 text-gray-400" />
                </div>
              )}

              <p className="text-xs text-gray-500 mt-4">
                Open your banking app and scan the QR code
              </p>
            </div>
          </div>

          {/* Countdown Timer */}
          {countdown > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center mb-6">
              <p className="text-sm text-orange-700">
                Payment expires in: <span className="font-bold text-lg">{formatCountdown(countdown)}</span>
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Icon icon="heroicons:information-circle" className="size-5" />
              Payment Instructions
            </h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Open your mobile banking app</li>
              <li>Select &ldquo;Scan QR&rdquo; and scan the code above</li>
              <li>Verify the payment amount and content</li>
              <li>Confirm the payment</li>
              <li>Wait for confirmation (this page will update automatically)</li>
            </ol>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Icon icon="heroicons:arrow-path" className="size-5 animate-spin" />
            <span className="text-sm">Waiting for payment...</span>
          </div>
        </div>
      </main>
      <LandingFooter />
    </>
  );
}
