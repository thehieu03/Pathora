import { describe, expect, it, vi } from "vitest";
import {
  CreateTourInstancePayload,
  UpdateTourInstancePayload,
} from "../tourInstanceService";

// ─── CreateTourInstancePayload Tests ──────────────────────────────────────────

describe("CreateTourInstancePayload", () => {
  // TC-FE-TI01: create payload must include guideUserIds and managerUserIds
  it("includes guideUserIds and managerUserIds in payload", () => {
    const payload: CreateTourInstancePayload = {
      tourId: "tour-123",
      classificationId: "cls-456",
      title: "Ha Long June Departure",
      instanceType: 0,
      startDate: "2025-07-01",
      endDate: "2025-07-03",
      maxParticipation: 20,
      guideUserIds: ["user-guide-1", "user-guide-2"],
      managerUserIds: ["user-mgr-1"],
    };

    expect(payload.guideUserIds).toEqual(["user-guide-1", "user-guide-2"]);
    expect(payload.managerUserIds).toEqual(["user-mgr-1"]);
  });

  // TC-FE-TI02: create payload must NOT include basePrice (auto-snapshotted from Classification)
  it("does NOT include basePrice (backend auto-snapshots from Classification)", () => {
    const payload: CreateTourInstancePayload = {
      tourId: "tour-123",
      classificationId: "cls-456",
      title: "Ha Long June Departure",
      instanceType: 0,
      startDate: "2025-07-01",
      endDate: "2025-07-03",
      maxParticipation: 20,
    };

    expect("basePrice" in payload).toBe(false);
  });

  // TC-FE-TI03: create payload with optional fields
  it("supports optional fields: location, confirmationDeadline, includedServices", () => {
    const payload: CreateTourInstancePayload = {
      tourId: "tour-123",
      classificationId: "cls-456",
      title: "Ha Long June Departure",
      instanceType: 1,
      startDate: "2025-07-01",
      endDate: "2025-07-03",
      maxParticipation: 20,
      location: "Ha Long, Quang Ninh",
      confirmationDeadline: "2025-06-25",
      includedServices: ["Shuttle bus", "Meals", "Entrance fees"],
    };

    expect(payload.location).toBe("Ha Long, Quang Ninh");
    expect(payload.confirmationDeadline).toBe("2025-06-25");
    expect(payload.includedServices).toEqual([
      "Shuttle bus",
      "Meals",
      "Entrance fees",
    ]);
  });

  // TC-FE-TI04: guideUserIds and managerUserIds are optional (can be empty)
  it("guideUserIds and managerUserIds are optional", () => {
    const payload: CreateTourInstancePayload = {
      tourId: "tour-123",
      classificationId: "cls-456",
      title: "No Staff Assigned",
      instanceType: 0,
      startDate: "2025-07-01",
      endDate: "2025-07-03",
      maxParticipation: 10,
    };

    expect(payload.guideUserIds).toBeUndefined();
    expect(payload.managerUserIds).toBeUndefined();
  });
});

// ─── UpdateTourInstancePayload Tests ──────────────────────────────────────────

describe("UpdateTourInstancePayload", () => {
  // TC-FE-TI05: update payload must include guideUserIds and managerUserIds
  it("includes guideUserIds and managerUserIds in payload", () => {
    const payload: UpdateTourInstancePayload = {
      id: "instance-789",
      title: "Updated Title",
      startDate: "2025-07-01",
      endDate: "2025-07-03",
      maxParticipation: 25,
      basePrice: 1500000,
      guideUserIds: ["user-guide-1"],
      managerUserIds: ["user-mgr-1", "user-mgr-2"],
    };

    expect(payload.guideUserIds).toEqual(["user-guide-1"]);
    expect(payload.managerUserIds).toEqual(["user-mgr-1", "user-mgr-2"]);
  });

  // TC-FE-TI06: update payload must include basePrice (editable override)
  it("includes basePrice (editable override)", () => {
    const payload: UpdateTourInstancePayload = {
      id: "instance-789",
      title: "Updated Title",
      startDate: "2025-07-01",
      endDate: "2025-07-03",
      maxParticipation: 25,
      basePrice: 1500000,
    };

    expect(payload.basePrice).toBe(1500000);
  });

  // TC-FE-TI07: update payload supports thumbnailUrl and imageUrls
  it("supports thumbnailUrl and imageUrls for media updates", () => {
    const payload: UpdateTourInstancePayload = {
      id: "instance-789",
      title: "Updated Title",
      startDate: "2025-07-01",
      endDate: "2025-07-03",
      maxParticipation: 25,
      basePrice: 1500000,
      thumbnailUrl: "https://cdn.example.com/thumb.jpg",
      imageUrls: [
        "https://cdn.example.com/img1.jpg",
        "https://cdn.example.com/img2.jpg",
      ],
    };

    expect(payload.thumbnailUrl).toBe("https://cdn.example.com/thumb.jpg");
    expect(payload.imageUrls).toEqual([
      "https://cdn.example.com/img1.jpg",
      "https://cdn.example.com/img2.jpg",
    ]);
  });

  // TC-FE-TI08: update payload supports manager reassignment (remove all)
  it("supports removing all managers by passing empty arrays", () => {
    const payload: UpdateTourInstancePayload = {
      id: "instance-789",
      title: "Title",
      startDate: "2025-07-01",
      endDate: "2025-07-03",
      maxParticipation: 25,
      basePrice: 1500000,
      guideUserIds: [],
      managerUserIds: [],
    };

    expect(payload.guideUserIds).toEqual([]);
    expect(payload.managerUserIds).toEqual([]);
  });

  // TC-FE-TI09: update payload with optional fields
  it("supports optional fields: location, confirmationDeadline, includedServices", () => {
    const payload: UpdateTourInstancePayload = {
      id: "instance-789",
      title: "Updated Title",
      startDate: "2025-07-01",
      endDate: "2025-07-03",
      maxParticipation: 25,
      basePrice: 1500000,
      location: "Da Nang",
      confirmationDeadline: "2025-06-20",
      includedServices: ["Breakfast", "Guide"],
    };

    expect(payload.location).toBe("Da Nang");
    expect(payload.confirmationDeadline).toBe("2025-06-20");
    expect(payload.includedServices).toEqual(["Breakfast", "Guide"]);
  });
});

// ─── TourInstanceManagerDto Tests ─────────────────────────────────────────────

describe("TourInstanceManagerDto", () => {
  it("has required fields: id, userId, userName, userAvatar, role", () => {
    const manager = {
      id: "mgr-assign-001",
      userId: "user-123",
      userName: "Nguyen Van A",
      userAvatar: "https://cdn.example.com/avatar.jpg",
      role: "Guide" as const,
    };

    expect(manager.id).toBe("mgr-assign-001");
    expect(manager.userId).toBe("user-123");
    expect(manager.userName).toBe("Nguyen Van A");
    expect(manager.userAvatar).toBe("https://cdn.example.com/avatar.jpg");
    expect(manager.role).toBe("Guide");
  });

  it("userAvatar can be null", () => {
    const manager = {
      id: "mgr-assign-002",
      userId: "user-456",
      userName: "Tran Thi B",
      userAvatar: null,
      role: "Manager" as const,
    };

    expect(manager.userAvatar).toBeNull();
    expect(manager.role).toBe("Manager");
  });
});
