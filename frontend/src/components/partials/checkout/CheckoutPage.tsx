"use client";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui";
import { LandingHeader } from "../shared/LandingHeader";
import { LandingFooter } from "../shared/LandingFooter";
import { useTranslation } from "react-i18next";

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

/* ══════════════════════════════════════════════════════════════
   ██  CheckoutPage
   ══════════════════════════════════════════════════════════════ */
export function CheckoutPage() {
  const { t } = useTranslation();

  /* ── State ─────────────────────────────────────────────── */
  const [paymentOption, setPaymentOption] = useState<"full" | "deposit">(
    "deposit",
  );
  const [paymentMethod, setPaymentMethod] = useState<"qr" | "cash">("qr");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [acknowledgeInfo, setAcknowledgeInfo] = useState(false);

  /* ── Derived ──────────────────────────────────────────── */
  const totalPrice = SAMPLE_BOOKING.pricePerAdult * SAMPLE_BOOKING.adults;
  const depositAmount = Math.round(totalPrice * SAMPLE_BOOKING.depositRate);
  const remainingBalance = totalPrice - depositAmount;
  const payAmount = paymentOption === "full" ? totalPrice : depositAmount;
  const canConfirm = agreeTerms && acknowledgeInfo;

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

                  {/* Tour info row */}
                  <div className="flex gap-4 mb-4">
                    {/* Tour image */}
                    <div className="size-24 md:size-28 rounded-xl bg-gray-200 overflow-hidden shrink-0">
                      <img
                        src={SAMPLE_BOOKING.tourImage}
                        alt={SAMPLE_BOOKING.tourTitle}
                        className="size-full object-cover"
                      />
                    </div>

                    {/* Tour details */}
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 leading-5 line-clamp-2">
                        {SAMPLE_BOOKING.tourTitle}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Icon
                          icon="heroicons:map-pin"
                          className="size-3.5 shrink-0 text-gray-400"
                        />
                        {SAMPLE_BOOKING.location}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Icon
                          icon="heroicons:clock"
                          className="size-3.5 shrink-0 text-gray-400"
                        />
                        {SAMPLE_BOOKING.duration}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Icon
                          icon="heroicons:calendar"
                          className="size-3.5 shrink-0 text-gray-400"
                        />
                        {SAMPLE_BOOKING.dateRange}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Icon
                          icon="heroicons:users"
                          className="size-3.5 shrink-0 text-gray-400"
                        />
                        {SAMPLE_BOOKING.guests}
                      </div>
                      <span className="inline-flex items-center self-start px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-semibold mt-1">
                        {SAMPLE_BOOKING.category}
                      </span>
                    </div>
                  </div>

                  {/* Price Details */}
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">
                      {t("landing.checkout.priceDetails")}
                    </h4>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {t("landing.checkout.adults")} ×{" "}
                          {SAMPLE_BOOKING.adults}
                        </span>
                        <span className="font-semibold text-slate-900">
                          {fmt(totalPrice)}
                        </span>
                      </div>
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

                  {/* Payment Option (Full vs Deposit) */}
                  <div className="mt-4 flex flex-col gap-3">
                    {/* Full Payment */}
                    <Button
                      type="button"
                      onClick={() => setPaymentOption("full")}
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
                            {Math.round(SAMPLE_BOOKING.depositRate * 100)}%)
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

                  {/* Price breakdown */}
                  <div
                    className="rounded-xl p-4 flex flex-col gap-2 mb-5"
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
                  <Button
                    type="button"
                    disabled={!canConfirm}
                    className={`w-full h-12 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all ${
                      canConfirm
                        ? "bg-orange-500 hover:bg-orange-600 shadow-[0_4px_6px_0_#ffd6a8,0_2px_4px_0_#ffd6a8] cursor-pointer"
                        : "bg-orange-500 opacity-50 cursor-not-allowed shadow-[0_4px_6px_0_#ffd6a8,0_2px_4px_0_#ffd6a8]"
                    }`}>
                    {t("landing.checkout.confirmBooking")}
                    <Icon icon="heroicons:chevron-right" className="size-4" />
                  </Button>

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
