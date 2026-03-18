import { describe, expect, it } from "vitest";

import {
  isCancelReturn,
  mapTransactionStatusToNormalized,
  resolveReturnTransactionCode,
  shouldRedirectToHostedCheckout,
} from "../paymentFlowUtils";

const buildSearchParamsReader = (params: Record<string, string | undefined>) => ({
  get: (key: string) => params[key] ?? null,
});

describe("paymentFlowUtils", () => {
  it("maps completed transaction to paid", () => {
    expect(mapTransactionStatusToNormalized("Completed")).toBe("paid");
  });

  it("maps failed transaction with EXPIRED error to expired", () => {
    expect(mapTransactionStatusToNormalized("Failed", "EXPIRED")).toBe("expired");
  });

  it("resolves transaction code from callback query params", () => {
    const reader = buildSearchParamsReader({
      orderCode: "order-1",
      code: "code-2",
      transactionCode: "tx-3",
    });

    expect(resolveReturnTransactionCode(reader)).toBe("tx-3");
  });

  it("detects cancelled callback via status", () => {
    const reader = buildSearchParamsReader({ status: "cancelled" });

    expect(isCancelReturn(reader)).toBe(true);
  });

  it("detects hosted payos redirect URLs", () => {
    expect(shouldRedirectToHostedCheckout("https://my.payos.vn/login")).toBe(true);
    expect(shouldRedirectToHostedCheckout("https://example.com/payment")).toBe(false);
  });
});
