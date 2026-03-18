"use client";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui";
import { LandingHeader } from "@/features/shared/components/LandingHeader";
import { LandingFooter } from "@/features/shared/components/LandingFooter";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  paymentService,
  PaymentTransaction,
  CheckoutPriceResponse,
  type NormalizedPaymentStatus,
} from "@/api/services/paymentService";
import { handleApiError } from "@/utils/apiResponse";
import { useAuth } from "@/contexts/AuthContext";
import {
  isCancelReturn,
  mapTransactionStatusToNormalized,
  resolveReturnTransactionCode,
  shouldRedirectToHostedCheckout,
} from "@/features/checkout/components/paymentFlowUtils";

/* ── Sample Booking Data (would come from API/router state) ── */
const SAMPLE_BOOKING = {
  tourImage:
    "https://www.figma.com/api/mcp/asset/ffacfc3b-cdaf-4f2c-9e83-2b7c1e8e7c00",
  tourTitle: "Floating Market & Temple Day Tour by Long-Tail Boat",
  location: "Bangkok, Thailand",
  duration: "1 Day",
  dateRange: "Mar 18, 2026 - Mar 19",
  guests: "2 Adults",
  category: "Budget Tour",
  pricePerAdult: 950000,
  adults: 2,
  serviceFee: 0,
  depositRate: 0.3,
};

/* ── Helpers ───────────────────────────────────────────────── */
const fmt = (n: number) => "$" + n.toLocaleString("en-US");

const copyToClipboard = (text: string, successMsg: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toast.success(successMsg);
  });
};

/* ── Step Indicator ────────────────────────────────────────── */
function StepIndicator() {
  const { t } = useTranslation();

  const steps = [
    {
      label: t("landing.checkout.stepSelectTour"),
      status: "completed" as const,
    },
    { label: t("landing.checkout.stepCheckout"), status: "active" as const },
    {
      label: t("landing.checkout.stepConfirmation"),
      status: "upcoming" as const,
    },
  ];

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          {/* Step circle + label */}
          <div className="flex flex-col items-center gap-1.5">
            {step.status === "completed" ? (
              <div className="size-8 rounded-full bg-orange-500 flex items-center justify-center">
                <Icon icon="heroicons:check" className="size-4 text-white" />
              </div>
            ) : step.status === "active" ? (
              <div className="size-8 rounded-full bg-orange-500 flex items-center justify-center">
                <span className="text-sm font-bold text-white">{i + 1}</span>
              </div>
            ) : (
              <div className="size-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-400">{i + 1}</span>
              </div>
            )}
            <span
              className={`text-xs font-medium whitespace-nowrap ${
                step.status === "upcoming" ? "text-gray-400" : "text-gray-700"
              }`}>
              {step.label}
            </span>
          </div>

          {/* Connector line between steps */}
          {i < steps.length - 1 && (
            <div
              className={`h-0.5 w-8 md:w-15 mx-1 md:mx-2 -mt-5 ${
                i === 0 ? "bg-orange-500" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ── Section Card Header (dark gradient bar) ───────────────── */
function CardHeader({ title }: { title: string }) {
  return (
    <div className="bg-gradient-to-b from-orange-500 to-orange-600 h-1 w-full rounded-t-2xl" />
  );
}

/* ── Policy Section ────────────────────────────────────────── */
function PolicySection({
  icon,
  iconBg,
  iconColor,
  title,
  items,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  items: string[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div
          className={`size-8 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon icon={icon} className={`size-4 ${iconColor}`} />
        </div>
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      </div>
      <ul className="flex flex-col gap-1.5 pl-10">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-gray-600 leading-4">
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Payment Method Option ─────────────────────────────────── */
function PaymentOption({
  icon,
  label,
  description,
  selected,
  onClick,
}: {
  icon: string;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl border-2 transition-colors ${
        selected
          ? "border-orange-500 bg-orange-50"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}>
      {/* Radio circle */}
      <div
        className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
          selected ? "border-orange-500" : "border-gray-300"
        }`}>
        {selected && <div className="size-3 rounded-full bg-orange-500" />}
      </div>

      <Icon
        icon={icon}
        className={`size-5 shrink-0 ${selected ? "text-orange-500" : "text-gray-500"}`}
      />

      <div className="flex flex-col items-start text-left">
        <span
          className={`text-sm font-semibold ${
            selected ? "text-orange-500" : "text-slate-900"
          }`}>
          {label}
        </span>
        <span className="text-[10px] text-gray-400 font-medium">
          {description}
        </span>
      </div>
    </Button>
  );
}

/* ── Countdown Timer Hook ──────────────────────────────────── */
function useCountdown(expiredAt: string | undefined) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!expiredAt) return;

    const update = () => {
      const now = Date.now();
      const exp = new Date(expiredAt).getTime();
      const diff = exp - now;

      if (diff <= 0) {
        setTimeLeft("00:00");
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiredAt]);

  return timeLeft;
}

/* ── Bank Account Info Component ───────────────────────────── */
function BankAccountInfo({ t }: { t: (key: string) => string }) {
  return (
    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
      <div className="flex items-center gap-2 mb-3">
        <Icon icon="heroicons:building-library" className="size-5 text-blue-600" />
        <h4 className="text-sm font-semibold text-slate-900">
          {t("landing.checkout.bankAccountInfo")}
        </h4>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{t("landing.checkout.bankName")}</span>
          <span className="text-sm font-semibold text-slate-900">MBBank (MB)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{t("landing.checkout.accountNumber")}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900 font-mono">0378175727</span>
            <button
              type="button"
              onClick={() => copyToClipboard("0378175727", t("landing.checkout.copied"))}
              className="size-6 rounded-md bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors cursor-pointer">
              <Icon icon="heroicons:clipboard-document" className="size-3.5 text-blue-600" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{t("landing.checkout.accountHolder")}</span>
          <span className="text-sm font-semibold text-slate-900">PATHORA TRAVEL</span>
        </div>
      </div>
    </div>
  );
}

/* ── Payment Status Panel ──────────────────────────────────── */
function PaymentStatusPanel({
  transaction,
  normalizedStatus,
  t,
}: {
  transaction: PaymentTransaction;
  normalizedStatus: NormalizedPaymentStatus;
  t: (key: string) => string;
}) {
  const timeLeft = useCountdown(transaction.expiredAt);

  if (normalizedStatus === "paid") {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="size-16 rounded-full bg-green-100 flex items-center justify-center">
          <Icon icon="heroicons:check-circle" className="size-10 text-green-500" />
        </div>
        <h3 className="text-lg font-bold text-green-600">
          {t("landing.checkout.paymentReceived")}
        </h3>
        <p className="text-sm text-gray-500 text-center">
          {t("landing.checkout.paymentConfirmedDesc")}
        </p>
        <div className="bg-green-50 rounded-xl px-4 py-3 border border-green-200 w-full text-center">
          <span className="text-xs text-gray-500">{t("landing.checkout.transactionCode")}</span>
          <p className="text-lg font-bold font-mono text-green-600 mt-1">
            {transaction.transactionCode}
          </p>
        </div>
      </div>
    );
  }

  if (
    normalizedStatus === "failed"
    || normalizedStatus === "cancelled"
    || normalizedStatus === "expired"
  ) {
    const isCancelled = normalizedStatus === "cancelled";
    const isExpired = normalizedStatus === "expired";

    const iconName = isCancelled
      ? "heroicons:no-symbol"
      : isExpired
        ? "heroicons:clock"
        : "heroicons:x-circle";

    const iconStyles = isCancelled
      ? "bg-amber-100 text-amber-600"
      : isExpired
        ? "bg-slate-100 text-slate-500"
        : "bg-red-100 text-red-500";

    const title = isCancelled
      ? t("landing.checkout.paymentCancelled")
      : isExpired
        ? t("landing.checkout.paymentExpired")
        : t("landing.checkout.paymentFailed");

    const description = isCancelled
      ? t("landing.checkout.paymentCancelledDesc")
      : isExpired
        ? t("landing.checkout.paymentExpiredDesc")
        : t("landing.checkout.paymentFailedDesc");

    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <div className={`size-16 rounded-full flex items-center justify-center ${iconStyles}`}>
          <Icon icon={iconName} className="size-10" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-gray-500 text-center">{description}</p>
        <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 w-full text-center">
          <span className="text-xs text-gray-500">{t("landing.checkout.transactionCode")}</span>
          <p className="text-lg font-bold font-mono text-slate-900 mt-1">
            {transaction.transactionCode}
          </p>
        </div>
      </div>
    );
  }

  const statusSteps = ["Pending", "Processing", "Completed"] as const;
  const currentIdx = statusSteps.indexOf(
    transaction.status as (typeof statusSteps)[number],
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Status indicator */}
      <div className="flex items-center justify-between bg-orange-50 rounded-xl px-4 py-3 border border-orange-200">
        <div className="flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-orange-400 animate-pulse" />
          <span className="text-sm font-semibold text-orange-600">
            {t("landing.checkout.awaitingPayment")}
          </span>
        </div>
        {timeLeft && (
          <div className="flex items-center gap-1.5">
            <Icon icon="heroicons:clock" className="size-4 text-orange-500" />
            <span className="text-sm font-mono font-bold text-orange-600">{timeLeft}</span>
          </div>
        )}
      </div>

      {/* Transaction code — large, copyable */}
      <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
        <span className="text-xs text-gray-500 block mb-1">
          {t("landing.checkout.transactionCode")}
        </span>
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl font-bold font-mono text-slate-900 tracking-wider">
            {transaction.transactionCode}
          </span>
          <button
            type="button"
            onClick={() =>
              copyToClipboard(transaction.transactionCode, t("landing.checkout.copied"))
            }
            className="size-8 rounded-lg bg-orange-100 hover:bg-orange-200 flex items-center justify-center transition-colors cursor-pointer">
            <Icon icon="heroicons:clipboard-document" className="size-4 text-orange-600" />
          </button>
        </div>
      </div>

      {/* QR code image */}
      {transaction.qrCodeUrl && (
        <div className="bg-white rounded-xl p-4 border border-gray-200 flex flex-col items-center">
          <img
            src={transaction.qrCodeUrl}
            alt="Payment QR Code"
            className="size-48 rounded-lg object-contain"
          />
          <p className="text-xs font-semibold text-slate-900 mt-3">
            {t("landing.checkout.scanToPay")}
          </p>
        </div>
      )}

      {/* Bank account details */}
      <BankAccountInfo t={t} />

      {/* Status progress */}
      <div className="flex items-center justify-between px-2">
        {statusSteps.map((step, i) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`size-6 rounded-full flex items-center justify-center ${
                  i <= currentIdx
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}>
                {i < currentIdx ? (
                  <Icon icon="heroicons:check" className="size-3.5" />
                ) : (
                  <span className="text-[10px] font-bold">{i + 1}</span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  i <= currentIdx ? "text-orange-600" : "text-gray-400"
                }`}>
                {t(`landing.checkout.status${step}`)}
              </span>
            </div>
            {i < statusSteps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 -mt-4 ${
                  i < currentIdx ? "bg-orange-500" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center">
        {t("landing.checkout.transferInstructions")}
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ██  CheckoutPage
   ══════════════════════════════════════════════════════════════ */
export function CheckoutPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  /* ── State ─────────────────────────────────────────────── */
  const [paymentOption, setPaymentOption] = useState<"full" | "deposit">(
    "deposit",
  );
  const [paymentMethod, setPaymentMethod] = useState<"qr" | "cash" | "bank_transfer">("qr");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [acknowledgeInfo, setAcknowledgeInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState<PaymentTransaction | null>(null);
  const [normalizedStatus, setNormalizedStatus] = useState<NormalizedPaymentStatus>("pending");
  const [checkoutPrice, setCheckoutPrice] = useState<CheckoutPriceResponse | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [priceError, setPriceError] = useState<string | null>(null);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Get booking ID or tour instance info from URL ───── */
  const bookingIdParam = searchParams.get("bookingId");
  const tourInstanceIdParam = searchParams.get("tourInstanceId");
  const tourNameParam = searchParams.get("tourName");
  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");
  const locationParam = searchParams.get("location");
  const depositPerPersonParam = searchParams.get("depositPerPerson");

  /* ── State for tour instance booking ─────────────────── */
  const [tourInstanceBooking, setTourInstanceBooking] = useState<{
    tourInstanceId: string;
    tourName: string;
    startDate: string;
    endDate: string;
    location: string;
    depositPerPerson: number;
  } | null>(null);

  /* ── Initialize tour instance booking from URL params ──── */
  useEffect(() => {
    if (tourInstanceIdParam && tourNameParam) {
      setTourInstanceBooking({
        tourInstanceId: tourInstanceIdParam,
        tourName: tourNameParam,
        startDate: startDateParam || "",
        endDate: endDateParam || "",
        location: locationParam || "",
        depositPerPerson: depositPerPersonParam ? Number(depositPerPersonParam) : 0,
      });
      setLoadingPrice(false);
    }
  }, [tourInstanceIdParam, tourNameParam, startDateParam, endDateParam, locationParam, depositPerPersonParam]);

  /* ── Fetch checkout price from API ────────────────────── */
  useEffect(() => {
    if (!bookingIdParam) {
      setLoadingPrice(false);
      return;
    }

    const fetchCheckoutPrice = async () => {
      try {
        setLoadingPrice(true);
        setPriceError(null);
        const price = await paymentService.getCheckoutPrice(bookingIdParam);
        if (price) {
          setCheckoutPrice(price);
        }
      } catch (error) {
        const handledError = handleApiError(error);
        console.error("Failed to fetch checkout price:", handledError.message);
        setPriceError(handledError.message);
      } finally {
        setLoadingPrice(false);
      }
    };

    fetchCheckoutPrice();
  }, [bookingIdParam]);

  /* ── Derived ──────────────────────────────────────────── */
  const bookingId = bookingIdParam ?? "";
  const hasCheckoutPrice = !!checkoutPrice;
  const hasTourInstanceBooking = !!tourInstanceBooking;
  const totalPrice = checkoutPrice?.totalPrice ?? (tourInstanceBooking?.depositPerPerson ?? 0);
  const depositAmount = checkoutPrice?.depositAmount ?? (tourInstanceBooking?.depositPerPerson ?? 0);
  const remainingBalance = checkoutPrice?.remainingBalance ?? 0;
  const payAmount = paymentOption === "full" ? totalPrice : depositAmount;
  const canConfirm = agreeTerms && acknowledgeInfo && !loading && !transaction && (hasCheckoutPrice || hasTourInstanceBooking);

  useEffect(() => {
    if (!transaction) {
      setNormalizedStatus("pending");
      return;
    }

    setNormalizedStatus(mapTransactionStatusToNormalized(transaction.status, transaction.errorCode));
  }, [transaction]);

  /* ── Polling for payment status ────────────────────────── */
  const startPolling = useCallback((transactionCode: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(async () => {
      try {
        const statusSnapshot = await paymentService.getNormalizedStatus(transactionCode);
        setNormalizedStatus(statusSnapshot.normalizedStatus);

        const updated = await paymentService.getTransaction(transactionCode);
        if (updated) {
          setTransaction(updated);
        }

        if (statusSnapshot.normalizedStatus === "paid") {
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
        } else if (
          statusSnapshot.normalizedStatus === "failed"
          || statusSnapshot.normalizedStatus === "cancelled"
          || statusSnapshot.normalizedStatus === "expired"
        ) {
          toast.error(t("landing.checkout.paymentFailed"));
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
        }
      } catch {
        // Silently retry on network errors
      }
    }, 5000);
  }, [t]);

  /* ── Handle redirect return/cancel from hosted payment ───── */
  useEffect(() => {
    const transactionCode = resolveReturnTransactionCode(searchParams);
    if (!transactionCode) {
      return;
    }

    const reconcilePayment = async () => {
      try {
        const snapshot = isCancelReturn(searchParams)
          ? await paymentService.reconcileCancel(transactionCode)
          : await paymentService.reconcileReturn(transactionCode);

        setNormalizedStatus(snapshot.normalizedStatus);

        const updatedTransaction = await paymentService.getTransaction(transactionCode);
        if (updatedTransaction) {
          setTransaction(updatedTransaction);
        }

        if (snapshot.normalizedStatus === "paid") {
          toast.success(t("landing.checkout.paymentReceived"));
          return;
        }

        if (snapshot.isTerminal) {
          toast.error(t("landing.checkout.paymentFailed"));
          return;
        }

        startPolling(transactionCode);
      } catch (error: unknown) {
        const handledError = handleApiError(error);
        console.error("Failed to reconcile hosted payment return:", handledError.message);
        toast.error(t("landing.checkout.transactionError"));
      }
    };

    reconcilePayment();
  }, [searchParams, startPolling, t]);

  /* ── Cleanup polling on unmount ────────────────────────── */
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, []);

  /* ── Handle Confirm Booking ────────────────────────────── */
  const handleConfirmBooking = async () => {
    setLoading(true);

    const mapPaymentMethod = (method: "qr" | "cash" | "bank_transfer") => {
      switch (method) {
        case "qr":
          return "BankTransfer" as const;
        case "bank_transfer":
          return "BankTransfer" as const;
        case "cash":
          return "Cash" as const;
      }
    };

    try {
      const result = await paymentService.createTransaction({
        bookingId,
        type: paymentOption === "full" ? "FullPayment" : "Deposit",
        amount: payAmount,
        paymentMethod: mapPaymentMethod(paymentMethod),
        paymentNote: `Payment for ${checkoutPrice?.tourName ?? "Tour"} - ${paymentOption === "full" ? "Full Payment" : `Deposit ${Math.round((checkoutPrice?.depositPercentage ?? 0.3) * 100)}%`}`,
        createdBy: user?.email ?? user?.username ?? "guest",
      });

      if (result) {
        setTransaction(result);

        if (shouldRedirectToHostedCheckout(result.qrCodeUrl)) {
          window.location.assign(result.qrCodeUrl!);
          return;
        }

        toast.success(t("landing.checkout.transactionCreated"));
        startPolling(result.transactionCode);
      }
    } catch (error: unknown) {
      const handledError = handleApiError(error);
      console.error("Failed to create transaction:", handledError.message);
      toast.error(t("landing.checkout.transactionError"));
    } finally {
      setLoading(false);
    }
  };

  /* ── Cancellation Policy items ────────────────────────── */
  const cancellationItems = [
    t("landing.checkout.cancelItem1"),
    t("landing.checkout.cancelItem2"),
    t("landing.checkout.cancelItem3"),
    t("landing.checkout.cancelItem4"),
  ];

  const paymentTermItems = [
    t("landing.checkout.payTermItem1"),
    t("landing.checkout.payTermItem2"),
    t("landing.checkout.payTermItem3"),
    t("landing.checkout.payTermItem4"),
  ];

  const importantInfoItems = [
    t("landing.checkout.infoItem1"),
    t("landing.checkout.infoItem2"),
    t("landing.checkout.infoItem3"),
    t("landing.checkout.infoItem4"),
    t("landing.checkout.infoItem5"),
  ];

  return (
    <>
      <LandingHeader />

      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-330 mx-auto px-4 md:px-3.75 py-6 md:py-10">
          {/* ── Back to Tour ──────────────────────────────── */}
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 transition-colors mb-6">
            <Icon icon="heroicons:arrow-left" className="size-4" />
            {t("landing.checkout.backToTour")}
          </Link>

          {/* ── Step Indicator ────────────────────────────── */}
          <StepIndicator />

          {/* ── Two-column layout ─────────────────────────── */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* ════════ LEFT COLUMN ════════════════════════ */}
            <div className="flex-1 flex flex-col gap-4">
              {/* ── Booking Summary Card ──────────────────── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <CardHeader title="" />
                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-900 mb-4">
                    {t("landing.checkout.bookingSummary")}
                  </h3>

                  {/* Loading/Error/Content */}
                  {loadingPrice ? (
                    <div className="flex items-center justify-center py-8">
                      <Icon icon="heroicons:arrow-path" className="size-8 animate-spin text-orange-500" />
                    </div>
                  ) : priceError || (!checkoutPrice && !tourInstanceBooking) ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Icon icon="heroicons:exclamation-circle" className="size-10 text-red-500 mb-2" />
                      <p className="text-sm text-red-500">{priceError || "No booking found"}</p>
                      <Link href="/tours" className="text-sm text-orange-500 hover:underline mt-2">
                        {t("landing.checkout.backToTour")}
                      </Link>
                    </div>
                  ) : tourInstanceBooking && !checkoutPrice ? (
                    /* Tour instance booking without existing booking - show info */
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Icon icon="heroicons:information-circle" className="size-10 text-orange-500 mb-2" />
                      <p className="text-sm text-gray-600 mb-4">
                        {t("landing.checkout.bookingInProgress", "Setting up your booking...")}
                      </p>
                      <div className="bg-gray-50 rounded-xl p-4 text-left w-full max-w-md">
                        <h4 className="font-semibold text-slate-900 mb-2">{tourInstanceBooking.tourName}</h4>
                        <p className="text-xs text-gray-500">
                          📍 {tourInstanceBooking.location || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          📅 {tourInstanceBooking.startDate} - {tourInstanceBooking.endDate}
                        </p>
                        <p className="text-xs text-gray-500 mt-2 font-semibold text-orange-500">
                          💰 Deposit: {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(tourInstanceBooking.depositPerPerson)}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 mt-4">
                        {t("landing.checkout.bookingComingSoon", "Booking system integration in progress. Please contact support or try again later.")}
                      </p>
                      <Link href="/tours" className="text-sm text-orange-500 hover:underline mt-4">
                        {t("landing.checkout.backToTour")}
                      </Link>
                    </div>
                  ) : (
                    <>
                      {/* Tour info row */}
                      <div className="flex gap-4 mb-4">
                        {/* Tour image */}
                        <div className="size-24 md:size-28 rounded-xl bg-gray-200 overflow-hidden shrink-0">
                          <img
                            src={checkoutPrice.thumbnailUrl || "/placeholder-tour.jpg"}
                            alt={checkoutPrice.tourName}
                            className="size-full object-cover"
                          />
                        </div>

                        {/* Tour details */}
                        <div className="flex flex-col gap-1.5 min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 leading-5 line-clamp-2">
                            {checkoutPrice.tourName}
                          </h4>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Icon
                              icon="heroicons:map-pin"
                              className="size-3.5 shrink-0 text-gray-400"
                            />
                            {checkoutPrice.location || "N/A"}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Icon
                              icon="heroicons:clock"
                              className="size-3.5 shrink-0 text-gray-400"
                            />
                            {checkoutPrice.durationDays} {checkoutPrice.durationDays === 1 ? "Day" : "Days"}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Icon
                              icon="heroicons:calendar"
                              className="size-3.5 shrink-0 text-gray-400"
                            />
                            {new Date(checkoutPrice.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - {new Date(checkoutPrice.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Icon
                              icon="heroicons:users"
                              className="size-3.5 shrink-0 text-gray-400"
                            />
                            {checkoutPrice.numberAdult} Adults
                            {checkoutPrice.numberChild > 0 && `, ${checkoutPrice.numberChild} Children`}
                            {checkoutPrice.numberInfant > 0 && `, ${checkoutPrice.numberInfant} Infants`}
                          </div>
                          <span className="inline-flex items-center self-start px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-semibold mt-1">
                            {checkoutPrice.tourCode}
                          </span>
                        </div>
                      </div>

                      {/* Price Details */}
                      <div className="border-t border-gray-100 pt-4">
                        <h4 className="text-sm font-semibold text-slate-900 mb-3">
                          {t("landing.checkout.priceDetails")}
                        </h4>

                        <div className="flex flex-col gap-2">
                          {/* Adult price breakdown */}
                          {checkoutPrice.numberAdult > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">
                                {t("landing.checkout.adults")} × {checkoutPrice.numberAdult}
                              </span>
                              <span className="font-semibold text-slate-900">
                                {fmt(checkoutPrice.adultSubtotal)}
                              </span>
                            </div>
                          )}
                          {/* Child price breakdown */}
                          {checkoutPrice.numberChild > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">
                                {t("landing.checkout.children") || "Children"} × {checkoutPrice.numberChild}
                              </span>
                              <span className="font-semibold text-slate-900">
                                {fmt(checkoutPrice.childSubtotal)}
                              </span>
                            </div>
                          )}
                          {/* Infant price breakdown */}
                          {checkoutPrice.numberInfant > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">
                                {t("landing.checkout.infants") || "Infants"} × {checkoutPrice.numberInfant}
                              </span>
                              <span className="font-semibold text-slate-900">
                                {fmt(checkoutPrice.infantSubtotal)}
                              </span>
                            </div>
                          )}
                          {/* Tax line item */}
                          {checkoutPrice.taxAmount > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">
                                {t("landing.checkout.tax") || "Tax"} ({checkoutPrice.taxRate}%)
                              </span>
                              <span className="font-semibold text-slate-900">
                                {fmt(checkoutPrice.taxAmount)}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {t("landing.checkout.serviceFee")}
                            </span>
                            <span className="font-semibold text-green-500">
                              {t("landing.checkout.free")}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <span className="text-sm font-bold text-slate-900">
                              {t("landing.checkout.total")}
                            </span>
                            <span className="text-xl font-bold text-orange-500">
                              {fmt(totalPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Payment Option (Full vs Deposit) */}
                  <div className="mt-4 flex flex-col gap-3">
                    {/* Full Payment */}
                    <Button
                      type="button"
                      onClick={() => setPaymentOption("full")}
                      disabled={!!transaction}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-colors ${
                        paymentOption === "full"
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}>
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            paymentOption === "full"
                              ? "border-orange-500"
                              : "border-gray-300"
                          }`}>
                          {paymentOption === "full" && (
                            <div className="size-3 rounded-full bg-orange-500" />
                          )}
                        </div>
                        <div className="flex flex-col items-start text-left">
                          <span className="text-sm font-semibold text-slate-900">
                            {t("landing.checkout.fullPayment")}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {t("landing.checkout.fullPaymentDesc")}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-900">
                        {fmt(totalPrice)}
                      </span>
                    </Button>

                    {/* Deposit 30% */}
                    <Button
                      type="button"
                      onClick={() => setPaymentOption("deposit")}
                      disabled={!!transaction}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-colors ${
                        paymentOption === "deposit"
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}>
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            paymentOption === "deposit"
                              ? "border-orange-500"
                              : "border-gray-300"
                          }`}>
                          {paymentOption === "deposit" && (
                            <div className="size-3 rounded-full bg-orange-500" />
                          )}
                        </div>
                        <div className="flex flex-col items-start text-left">
                          <span className="text-sm font-semibold text-slate-900">
                            {t("landing.checkout.deposit")} (
                            {Math.round((checkoutPrice?.depositPercentage ?? 0.3) * 100)}%)
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {t("landing.checkout.depositDesc")}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-900">
                        {fmt(depositAmount)}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* ── Terms & Conditions Card ────────────────── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <CardHeader title="" />
                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-900 mb-4">
                    {t("landing.checkout.termsConditions")}
                  </h3>

                  <div className="flex flex-col gap-5">
                    {/* Cancellation Policy */}
                    <PolicySection
                      icon="heroicons:shield-check"
                      iconBg="bg-green-50"
                      iconColor="text-green-500"
                      title={t("landing.checkout.cancellationPolicy")}
                      items={cancellationItems}
                    />

                    {/* Payment Terms */}
                    <PolicySection
                      icon="heroicons:credit-card"
                      iconBg="bg-blue-50"
                      iconColor="text-blue-500"
                      title={t("landing.checkout.paymentTerms")}
                      items={paymentTermItems}
                    />

                    {/* Important Information */}
                    <PolicySection
                      icon="heroicons:exclamation-circle"
                      iconBg="bg-red-50"
                      iconColor="text-red-500"
                      title={t("landing.checkout.importantInfo")}
                      items={importantInfoItems}
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="border-t border-gray-200 mt-5 pt-4 flex flex-col gap-3">
                    <Checkbox
                      value={acknowledgeInfo}
                      onChange={() => setAcknowledgeInfo(!acknowledgeInfo)}
                      activeClass="!bg-orange-500 !ring-orange-500 !border-orange-500"
                      label={
                        <span className="text-xs text-gray-600 font-medium leading-4">
                          {t("landing.checkout.acknowledgePrefix")}{" "}
                          <span className="font-semibold text-orange-500">
                            {t("landing.checkout.importantInfoLink")}
                          </span>{" "}
                        </span>
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ════════ RIGHT COLUMN (sidebar) ════════════ */}
            <div className="w-full lg:w-96 shrink-0 flex flex-col gap-4">
              {/* ── Payment Method Card ────────────────────── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
                <CardHeader title="" />
                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-900 mb-4">
                    {t("landing.checkout.paymentMethod")}
                  </h3>

                  {/* ── Transaction created: show status panel ── */}
                  {transaction ? (
                    <PaymentStatusPanel
                      transaction={transaction}
                      normalizedStatus={normalizedStatus}
                      t={t}
                    />
                  ) : (
                    <>
                      {/* Method options */}
                      <div className="flex flex-col gap-3 mb-5">
                        <PaymentOption
                          icon="heroicons:device-phone-mobile"
                          label={t("landing.checkout.qrPayment")}
                          description={t("landing.checkout.qrPaymentDesc")}
                          selected={paymentMethod === "qr"}
                          onClick={() => setPaymentMethod("qr")}
                        />
                        <PaymentOption
                          icon="heroicons:building-library"
                          label={t("landing.checkout.bankTransferPayment")}
                          description={t("landing.checkout.bankTransferPaymentDesc")}
                          selected={paymentMethod === "bank_transfer"}
                          onClick={() => setPaymentMethod("bank_transfer")}
                        />
                        <PaymentOption
                          icon="heroicons:wallet"
                          label={t("landing.checkout.cashPayment")}
                          description={t("landing.checkout.cashPaymentDesc")}
                          selected={paymentMethod === "cash"}
                          onClick={() => setPaymentMethod("cash")}
                        />
                      </div>

                      {/* QR Code Display Area */}
                      {paymentMethod === "qr" && (
                        <div className="bg-gray-50 rounded-xl p-4 mb-5">
                          <div className="bg-white rounded-lg flex items-center justify-center h-56 mb-3">
                            <div
                              className="size-48 rounded-lg flex items-center justify-center"
                              style={{
                                backgroundImage:
                                  "linear-gradient(135deg, rgb(243,244,246) 0%, rgb(229,231,235) 100%)",
                              }}>
                              <div className="flex flex-col items-center gap-2">
                                <Icon
                                  icon="heroicons:device-phone-mobile"
                                  className="size-12 text-gray-400"
                                />
                                <span className="text-xs text-gray-500">
                                  QR Code Demo
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-semibold text-slate-900">
                              {t("landing.checkout.scanToPay")}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-1">
                              {t("landing.checkout.bankingAccepted")}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Bank Transfer Details Panel */}
                      {paymentMethod === "bank_transfer" && (
                        <div className="flex flex-col gap-4 mb-5">
                          {/* Bank account info */}
                          <BankAccountInfo t={t} />

                          {/* Transfer instructions */}
                          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                            <div className="flex items-start gap-2">
                              <Icon
                                icon="heroicons:information-circle"
                                className="size-5 text-amber-500 shrink-0 mt-0.5"
                              />
                              <div>
                                <p className="text-xs font-semibold text-amber-700 mb-1">
                                  {t("landing.checkout.transferNote")}
                                </p>
                                <p className="text-[11px] text-amber-600 leading-4">
                                  {t("landing.checkout.transferInstructions")}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* QR placeholder — will be populated after transaction creation */}
                          <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center">
                            <div className="size-40 rounded-lg bg-white border border-gray-200 flex items-center justify-center mb-2">
                              <div className="flex flex-col items-center gap-2">
                                <Icon
                                  icon="heroicons:qr-code"
                                  className="size-10 text-gray-300"
                                />
                                <span className="text-[10px] text-gray-400">
                                  {t("landing.checkout.qrAfterConfirm")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Price breakdown — always visible */}
                  <div
                    className="rounded-xl p-4 flex flex-col gap-2 mb-5 mt-5"
                    style={{
                      backgroundImage:
                        "linear-gradient(158deg, rgb(255,247,237) 0%, rgb(255,251,235) 100%)",
                      border: "1px solid #ffedd4",
                    }}>
                    {paymentOption === "deposit" ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {t("landing.checkout.deposit")} (30%)
                          </span>
                          <span className="text-lg font-bold text-slate-900">
                            {fmt(depositAmount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-b border-orange-200 pb-2">
                          <span className="text-xs text-gray-500">
                            {t("landing.checkout.remainingBalance")}
                          </span>
                          <span className="text-xs text-gray-500">
                            {fmt(remainingBalance)}
                          </span>
                        </div>
                      </>
                    ) : null}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">
                        {t("landing.checkout.total")}
                      </span>
                      <span className="text-2xl font-bold text-orange-500">
                        {fmt(totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Confirm Booking Button */}
                  {!transaction && (
                    <Button
                      type="button"
                      disabled={!canConfirm}
                      onClick={handleConfirmBooking}
                      className={`w-full h-12 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all ${
                        canConfirm
                          ? "bg-orange-500 hover:bg-orange-600 shadow-[0_4px_6px_0_#ffd6a8,0_2px_4px_0_#ffd6a8] cursor-pointer"
                          : "bg-orange-500 opacity-50 cursor-not-allowed shadow-[0_4px_6px_0_#ffd6a8,0_2px_4px_0_#ffd6a8]"
                      }`}>
                      {loading ? (
                        <>
                          <Icon
                            icon="heroicons:arrow-path"
                            className="size-4 animate-spin"
                          />
                          {t("landing.checkout.processing")}
                        </>
                      ) : (
                        <>
                          {t("landing.checkout.confirmBooking")}
                          <Icon icon="heroicons:chevron-right" className="size-4" />
                        </>
                      )}
                    </Button>
                  )}

                  <p className="text-center text-[10px] text-gray-400 mt-3">
                    {t("landing.checkout.secureBookingNote")}
                  </p>
                </div>
              </div>

              {/* ── Secure Booking Card ────────────────────── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 rounded-xl bg-green-50 flex items-center justify-center">
                    <Icon
                      icon="heroicons:shield-check"
                      className="size-5 text-green-500"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {t("landing.checkout.secureBooking")}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {t("landing.checkout.dataProtected")}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    t("landing.checkout.sslEncrypted"),
                    t("landing.checkout.noPaymentUntilConfirmed"),
                    t("landing.checkout.support247"),
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Icon
                        icon="heroicons:check"
                        className="size-3.5 text-green-500 shrink-0"
                      />
                      <span className="text-xs text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </>
  );
}
