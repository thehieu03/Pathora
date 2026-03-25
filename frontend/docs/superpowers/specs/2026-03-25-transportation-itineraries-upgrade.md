# Transportation + Itineraries Upgrade Spec

**Date:** 2026-03-25
**Status:** Draft
**Author:** Claude Opus

## 1. Overview

Upgrade the Create Tour wizard (Step Transportation + Step Itineraries) to support:
1. Fully bilingual transportation entries with correct backend payload structure.
2. Activity routes (from/to) linked to locations from Step Locations via index-based references with combobox UI.

## 2. Decisions

- **Route reference strategy**: Index-based reference to `locations[]` array. If a location entry is deleted, the route's index becomes dangling and is handled gracefully (warning + auto-clear).
- **Route from/to UI pattern**: Combobox/Auto-complete. Shows locations list from Step Locations + "Custom location..." option that reveals text inputs. User can also free-type to filter locations or enter custom text directly.
- **Transportation step**: Keep as free-text bilingual (no location picker needed — flights/buses between cities use generic place names). Fix payload mapping only.

## 3. Data Model Changes

### 3.1 ActivityForm — Add Routes Sub-Interface

File: `src/app/(dashboard)/tour-management/create/page.tsx`

Add `routes: ActivityRouteForm[]` to `ActivityForm`:

```typescript
interface ActivityRouteForm {
  id: string;                     // unique ID for this route within the activity
  fromLocationIndex: string;      // "" = custom text; "0","1",... = index into locations[]
  fromLocationCustom: string;     // VI custom text when fromLocationIndex === ""
  enFromLocationCustom: string;   // EN custom text when fromLocationIndex === ""
  toLocationIndex: string;        // same pattern
  toLocationCustom: string;
  enToLocationCustom: string;
  transportationType: string;     // "0"..."9","99"
  enTransportationType: string;
  transportationName: string;     // VI
  enTransportationName: string;   // EN
  durationMinutes: string;        // string input, parse to number in payload
  price: string;                  // string input, parse to number in payload
  note: string;                   // VI
  enNote: string;                 // EN
}

interface ActivityForm {
  activityType: string;
  title: string;
  enTitle: string;
  description: string;
  enDescription: string;
  note: string;
  enNote: string;
  estimatedCost: string;
  isOptional: boolean;
  startTime: string;
  endTime: string;
  linkToResources: string[];
  // NEW
  routes: ActivityRouteForm[];
}
```

### 3.2 Empty Factory

Update `emptyActivity()`:

```typescript
const emptyActivity = (): ActivityForm => ({
  activityType: "0",
  title: "",
  enTitle: "",
  description: "",
  enDescription: "",
  note: "",
  enNote: "",
  estimatedCost: "",
  isOptional: false,
  startTime: "",
  endTime: "",
  linkToResources: [""],
  // NEW
  routes: [],
});

const emptyRoute = (): ActivityRouteForm => ({
  id: crypto.randomUUID(),
  fromLocationIndex: "",
  fromLocationCustom: "",
  enFromLocationCustom: "",
  toLocationIndex: "",
  toLocationCustom: "",
  enToLocationCustom: "",
  transportationType: "0",
  enTransportationType: "",
  transportationName: "",
  enTransportationName: "",
  durationMinutes: "",
  price: "",
  note: "",
  enNote: "",
});
```

### 3.3 State Management

No new top-level state needed. `routes` lives inside each `dayPlans[i].activities[j].routes`.

Add CRUD helpers inside the create page:

```typescript
const addRoute = (pi: number, di: number, ai: number) => {
  setDayPlans((prev) => {
    const updated = [...prev];
    updated[pi].days[di].activities[ai].routes.push(emptyRoute());
    return updated;
  });
};

const removeRoute = (pi: number, di: number, ai: number, ri: number) => {
  setDayPlans((prev) => {
    const updated = [...prev];
    updated[pi].days[di].activities[ai].routes.splice(ri, 1);
    return updated;
  });
};

const updateRoute = (pi: number, di: number, ai: number, ri: number, field: keyof ActivityRouteForm, value: string) => {
  setDayPlans((prev) => {
    const updated = [...prev];
    (updated[pi].days[di].activities[ai].routes[ri] as any)[field] = value;
    return updated;
  });
};
```

**CRITICAL**: `updateActivity` and `addActivity` / `removeActivity` must preserve `routes` when copying/reordering activities.

## 4. UI — Activity Route Section in Itineraries

### 4.1 Placement

Within each activity card, below the Link to Resources section, before the activity footer (delete button).

### 4.2 Layout

```
┌──────────────────────────────────────────────────────────────┐
│ ... existing activity fields (activity type, times,          │
│     title VI/EN, description VI/EN, note VI/EN,             │
│     estimated cost, link to resources) ...                   │
│                                                              │
│  [ Route (N) ▶ / ▼ ]                          [+ Add Route] │
│ ┌────────────────────────────────────────────────────────── ┐│
│ │ From:  [ Combobox: locations list + Custom... ]           ││
│ │        [ Custom: VI text ] [ EN text ]   ← shown if custom││
│ │ To:    [ Combobox: locations list + Custom... ]           ││
│ │        [ Custom: VI text ] [ EN text ]   ← shown if custom││
│ │ ─────────────────────────────────────────────────────────  ││
│ │ Type: [Select ▼]   Name VI: [________]  Name EN: [_______] ││
│ │ Duration (min): [____]   Price: [____]                     ││
│ │ Note VI: [________________________] Note EN: [____________]││
│ │                                    [ Remove Route ]       ││
│ └────────────────────────────────────────────────────────── ┘│
└──────────────────────────────────────────────────────────────┘
```

### 4.3 Combobox Behavior

**State per combobox (`fromLocationIndex` / `toLocationIndex`):**
- `""` = custom text mode (default)
- `"0"`, `"1"`, ... = references `locations[index]`

**Rendering:**
- Read current value of `fromLocationIndex`
- If `""`: show custom text inputs (`fromLocationCustom`, `enFromLocationCustom`)
- If `"N"`: resolve `locations[N]` and show its `locationName` as the display value
  - If `N >= locations.length`: show warning "Location removed" + switch to custom mode + clear index

**Interaction:**
- Combobox dropdown shows:
  1. Section header "Pick from Locations" (disabled, non-selectable)
  2. List of `locations[i].locationName` items — each selectable
  3. Divider
  4. "Custom location..." — switches to custom mode, clears index
- When user types in the combobox: filter the locations list OR treat as custom text entry (if no match)
- When user clicks a location item: set `fromLocationIndex = i`, clear custom fields

**Implementation approach**: Use a `<div>` with absolute-positioned dropdown + manual state management. Keep it simple — no external combobox library needed.

## 5. Transportation Step — Verify & Fix Payload

### 5.1 Current State

The Transportation step UI already has all VI/EN fields. The issue is in `buildTransportationsPayload` (in `tourCreatePayload.ts`) which maps to plain `fromLocationName`/`toLocationName` strings instead of nested `TourPlanLocationDto` objects.

### 5.2 TransportationPayloadInput — Extend

```typescript
interface TransportationPayloadInput {
  // existing fields...
  fromLocationIndex: string;      // NEW: reference to locations[] if applicable
  toLocationIndex: string;        // NEW: reference to locations[] if applicable
  // For transportation step, these remain as free-text
  // but we need the structure to be correct for the backend
}
```

### 5.3 Fix buildTransportationsPayload

Check the backend contract. If `TourPlanRouteDto.fromLocation` is `TourPlanLocationDto | null`, the transportation payload needs to send:

```typescript
{
  fromLocationName: tr.fromLocation,           // plain VI text
  enFromLocationName: tr.enFromLocation,       // plain EN text
  toLocationName: tr.toLocation,
  enToLocationName: tr.enToLocation,
  // If backend expects nested TourPlanLocationDto, wrap:
  // fromLocation: { locationName: tr.fromLocation, enLocationName: tr.enFromLocation, type: null, enType: null },
  // toLocation:   { locationName: tr.toLocation,   enLocationName: tr.enToLocation,   type: null, enType: null },
  ...
}
```

**Action**: Verify the exact backend contract by checking the ASP.NET backend DTOs for transportation. If it uses `TourPlanLocationDto`, we need nested objects. If it uses flat strings, current mapping is fine. Make the minimal fix needed.

### 5.4 Transportation Type Numeric Mapping

Verify the enum mapping. UI options at lines 171-183 in `create/page.tsx`:

```typescript
const transportationTypes = [
  { value: "0", label: "Flight" },
  { value: "1", label: "Train" },
  { value: "2", label: "Bus" },
  { value: "3", label: "Car" },
  { value: "4", label: "Taxi" },
  { value: "5", label: "Boat" },
  { value: "6", label: "Ferry" },
  { value: "7", label: "Motorbike" },
  { value: "8", label: "Bicycle" },
  { value: "9", label: "Walking" },
  { value: "99", label: "Other" },
];
```

Check against `TransportationTypeMap` in `src/types/tour.ts`. Fix if there's a mismatch.

## 6. Payload Builder Changes

### 6.1 buildClassificationsPayload — Wire Routes

File: `src/api/services/tourCreatePayload.ts`

In `buildClassificationsPayload`, update the activity mapping to include routes:

```typescript
activities: dayPlan.activities.map((activity) => {
  const resolvedRoutes = activity.routes.map((route) => {
    const fromLoc = route.fromLocationIndex !== "" && parseInt(route.fromLocationIndex) < locations.length
      ? locations[parseInt(route.fromLocationIndex)]
      : null;

    const toLoc = route.toLocationIndex !== "" && parseInt(route.toLocationIndex) < locations.length
      ? locations[parseInt(route.toLocationIndex)]
      : null;

    return {
      transportationType: parseInt(route.transportationType) || 0,
      transportationName: route.transportationName || null,
      transportationNote: null,
      fromLocation: fromLoc
        ? { locationName: fromLoc.locationName, enLocationName: fromLoc.enLocationName, type: fromLoc.type || null, enType: fromLoc.enType || null }
        : route.fromLocationCustom.trim()
          ? { locationName: route.fromLocationCustom.trim(), enLocationName: route.enFromLocationCustom.trim(), type: null, enType: null }
          : null,
      toLocation: toLoc
        ? { locationName: toLoc.locationName, enLocationName: toLoc.enLocationName, type: toLoc.type || null, enType: toLoc.enType || null }
        : route.toLocationCustom.trim()
          ? { locationName: route.toLocationCustom.trim(), enLocationName: route.enToLocationCustom.trim(), type: null, enType: null }
          : null,
      estimatedDepartureTime: null,
      estimatedArrivalTime: null,
      durationMinutes: route.durationMinutes.trim() ? parseIntValue(route.durationMinutes, null) : null,
      distanceKm: null,
      price: route.price.trim() ? parseDecimal(route.price, null) : null,
      bookingReference: null,
      note: route.note.trim() || null,
    };
  });

  return {
    activityType: activity.activityType,
    title: activity.title,
    description: toOptionalString(activity.description),
    note: toOptionalString(activity.note),
    estimatedCost: parseDecimal(activity.estimatedCost, 0),
    isOptional: activity.isOptional,
    startTime: toOptionalString(activity.startTime),
    endTime: toOptionalString(activity.endTime),
    linkToResources: (activity.linkToResources ?? [])
      .map((l) => l.trim())
      .filter((l) => l.length > 0),
    // REPLACED routes: [] with resolved routes
    routes: resolvedRoutes,
    accommodation: null,
    translations: buildActivityTranslations(...),
  };
}),
```

### 6.2 Pass Locations to buildCreateTourFormData

`buildCreateTourFormData` needs access to `locations[]` to resolve route references. Update its signature:

```typescript
export const buildCreateTourFormData = (
  dayPlans: DayPlanPayloadInput[],
  images: File[],
  translations: TranslationPayloadInput[],
  classifications: ClassificationPayloadInput[],
  locations: LocationPayloadInput[],       // NEW
  transportations: TransportationPayloadInput[],
  // ...
) => { ... }
```

Update all call sites in `create/page.tsx` to pass `locations` to `buildCreateTourFormData`.

### 6.3 Pass locations to buildClassificationsPayload

```typescript
const buildClassificationsPayload = (
  dayPlans: DayPlanPayloadInput[],
  locations: LocationPayloadInput[],   // NEW
) => {
  // use locations to resolve route references
};
```

## 7. Validation — collectStepErrors (Step 2 — Itineraries)

```typescript
// Validate routes within each activity
dayPlans.forEach((plan, planIdx) => {
  plan.days.forEach((day, dayIdx) => {
    day.activities.forEach((act, actIdx) => {
      act.routes.forEach((route, routeIdx) => {
        const prefix = `plan_${planIdx}_day_${dayIdx}_act_${actIdx}_route_${routeIdx}`;

        // From location required
        const hasFrom = route.fromLocationIndex !== "" ||
          route.fromLocationCustom.trim() !== "";
        if (!hasFrom) {
          newErrors[`${prefix}_from`] = t("tourAdmin.validation.requiredFromLocation", "From location is required");
        }

        // Dangling from reference
        if (route.fromLocationIndex !== "" && parseInt(route.fromLocationIndex) >= locations.length) {
          newErrors[`${prefix}_from`] = t("tourAdmin.validation.locationRemoved", "Referenced location was removed");
        }

        // To location required
        const hasTo = route.toLocationIndex !== "" ||
          route.toLocationCustom.trim() !== "";
        if (!hasTo) {
          newErrors[`${prefix}_to`] = t("tourAdmin.validation.requiredToLocation", "To location is required");
        }

        // Dangling to reference
        if (route.toLocationIndex !== "" && parseInt(route.toLocationIndex) >= locations.length) {
          newErrors[`${prefix}_to`] = t("tourAdmin.validation.locationRemoved", "Referenced location was removed");
        }

        // Duration >= 0
        if (route.durationMinutes.trim()) {
          const d = Number(route.durationMinutes);
          if (Number.isNaN(d) || d < 0) {
            newErrors[`${prefix}_duration`] = t("tourAdmin.validation.invalidDuration", "Duration must be 0 or greater");
          }
        }

        // Price >= 0
        if (route.price.trim()) {
          const p = Number(route.price);
          if (Number.isNaN(p) || p < 0) {
            newErrors[`${prefix}_price`] = t("tourAdmin.validation.invalidPrice", "Price must be 0 or greater");
          }
        }
      });
    });
  });
});
```

### 7.1 i18n Keys Needed

In `en.json` and `vi.json` under `tourAdmin.validation`:

```json
"requiredFromLocation": "From location is required",
"requiredToLocation": "To location is required",
"locationRemoved": "Referenced location was removed",
"invalidDuration": "Duration must be 0 or greater",
"invalidPrice": "Price must be 0 or greater"
```

## 8. Edit Page Changes

File: `src/app/(dashboard)/tour-management/[id]/edit/page.tsx`

### 8.1 Add ActivityRouteForm

Same interface as `create/page.tsx`.

### 8.2 Update ActivityForm

Add `routes: ActivityRouteForm[]`.

### 8.3 Update emptyActivity

Return `routes: []`.

### 8.4 Add CRUD for Routes

Same `addRoute`, `removeRoute`, `updateRoute` helpers.

### 8.5 Hydrate Routes from API

When loading tour data, map `TourDayActivityDto.routes[]` to `ActivityRouteForm[]`. For each route's `fromLocation`/`toLocation`:
- If the location matches a location from Step Locations by name: set `fromLocationIndex` to that location's index
- Otherwise: set `fromLocationIndex = ""` and populate `fromLocationCustom`/`enFromLocationCustom` from the nested `TourPlanLocationDto` fields.

### 8.6 Render Route Section

Same collapsible Route section UI as the create page.

### 8.7 Send Routes in Update Payload

In the edit page's submit handler, send `routes` as part of the update payload using the same `buildClassificationsPayload` logic.

## 9. Regression Safety

- **Auto-day/package**: Adding/removing days/packages preserves all `routes` data (state lives inside activities).
- **Translations**: Bilingual fields (VI/EN) for routes handled via custom text inputs, not affected by auto-translation.
- **StartTime/EndTime**: Unchanged.
- **EstimatedCost**: Unchanged (added in previous feature).
- **LinkToResources**: Unchanged.
- **Publishing validation**: `collectStepErrors` already covers step transitions; route validation added there.
- **Payload builder**: `buildCreateTourFormData` gets new `locations` param; call sites updated.

## 10. Testing

### 10.1 Payload Tests

File: `src/api/services/__tests__/tourCreatePayload.test.ts`

Add test cases:

```typescript
it("converts activity routes with location reference to TourPlanRouteDto with nested TourPlanLocationDto", () => {
  // locations[0] = { locationName: "Ha Long Bay", enLocationName: "Ha Long Bay" }
  // activity.routes[0] = { fromLocationIndex: "0", toLocationIndex: "" ... }
  // Verify fromLocation is { locationName: "Ha Long Bay", enLocationName: "Ha Long Bay", type: null, enType: null }
  // Verify toLocation is { locationName: "...", enLocationName: "...", type: null, enType: null } from custom text
});

it("converts empty route from/to to null TourPlanLocationDto", () => {
  // route.fromLocationIndex = "" and fromLocationCustom = ""
  // Verify fromLocation is null
});

it("handles dangling location reference gracefully", () => {
  // route.fromLocationIndex = "999" but locations.length = 3
  // Verify fromLocation is null (graceful fallback)
});
```

### 10.2 Wiring Tests

File: `src/app/__tests__/tourTranslationFormWiring.test.ts`

Add to existing `describe("estimatedCost wiring")` block, or add new `describe("activity routes wiring")`:

```typescript
describe("activity routes wiring", () => {
  it("create page has routes in ActivityForm interface and renders route section", () => {
    const source = readFile("src/app/(dashboard)/tour-management/create/page.tsx");
    expect(source.includes("routes: ActivityRouteForm[]")).toBe(true);
    expect(source.includes("fromLocationIndex: string")).toBe(true);
    expect(source.includes("toLocationCustom: string")).toBe(true);
    expect(source.includes("enTransportationType: string")).toBe(true);
    expect(source.includes("emptyRoute")).toBe(true);
    expect(source.includes("addRoute")).toBe(true);
  });

  it("create page sends routes in buildCreateTourFormData call", () => {
    const source = readFile("src/app/(dashboard)/tour-management/create/page.tsx");
    // Verify routes is included in the dayPlans structure passed to buildCreateTourFormData
    expect(source.includes("routes: resolvedRoutes")).toBe(true);
    expect(source.includes("buildClassificationsPayload(dayPlans, locations")).toBe(true);
  });

  it("edit page has routes in ActivityForm and sends them in update payload", () => {
    const source = readFile("src/app/(dashboard)/tour-management/[id]/edit/page.tsx");
    expect(source.includes("routes: ActivityRouteForm[]")).toBe(true);
    expect(source.includes("emptyRoute")).toBe(true);
  });
});
```

## 11. File Change List

| File | Change |
|------|--------|
| `src/app/(dashboard)/tour-management/create/page.tsx` | Add `ActivityRouteForm` interface, `emptyRoute()`, update `ActivityForm`, add route CRUD, render collapsible Route section with combobox, pass `locations` to payload builder |
| `src/app/(dashboard)/tour-management/[id]/edit/page.tsx` | Same changes for edit page: add route interface, CRUD, UI, hydration from API |
| `src/api/services/tourCreatePayload.ts` | Update `buildCreateTourFormData` signature to accept `locations`, update `buildClassificationsPayload` to accept `locations`, wire routes resolution with nested `TourPlanLocationDto`, fix transportation payload if needed |
| `src/i18n/locales/en.json` | Add validation keys for routes |
| `src/i18n/locales/vi.json` | Add validation keys for routes |
| `src/api/services/__tests__/tourCreatePayload.test.ts` | Add payload tests for routes |
| `src/app/__tests__/tourTranslationFormWiring.test.ts` | Add wiring tests for routes |

## 12. Deliverables Checklist

- [ ] `ActivityRouteForm` interface added
- [ ] `emptyRoute()` factory added
- [ ] Route CRUD helpers added
- [ ] Route section UI rendered in create page activity card (combobox + custom fallback)
- [ ] `locations` passed to `buildCreateTourFormData`
- [ ] Routes resolved to `TourPlanRouteDto` with nested `TourPlanLocationDto`
- [ ] Validation wired in `collectStepErrors`
- [ ] i18n keys added
- [ ] Edit page mirrors all create page changes
- [ ] Payload tests pass
- [ ] Wiring tests pass
- [ ] `npm run build` succeeds
- [ ] Real payload example captured
