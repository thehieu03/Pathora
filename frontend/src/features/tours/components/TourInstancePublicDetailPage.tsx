"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Icon } from "@/components/ui";
import { LandingFooter } from "@/features/shared/components/LandingFooter";
import { LandingHeader } from "@/features/shared/components/LandingHeader";
import { homeService } from "@/api/services/homeService";
import {
  NormalizedTourInstanceDto,
  TourInstanceStatusMap,
} from "@/types/tour";

const formatCurrency = (value: number): string =>
  `${new Intl.NumberFormat("vi-VN").format(value)} VND`;

const toDateText = (value?: string | null): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB");
};

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const normalized = status.trim().toLowerCase().replace(/[\s_]+/g, "");
  const config = TourInstanceStatusMap[normalized] ?? {
    label: status,
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`size-2 rounded-full ${config.dot}`} />
      {t(`tourInstance.statusLabels.${normalized}`, config.label)}
    </span>
  );
}

export function TourInstancePublicDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<NormalizedTourInstanceDto | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const detail = await homeService.getPublicInstanceDetail(id);
        setData(detail);
      } catch (error) {
        console.error("Failed to load public instance detail", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const heroImage = useMemo(() => {
    if (!data) return "";
    return data.thumbnail?.publicURL || data.images[0]?.publicURL || "";
  }, [data]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <LandingHeader variant="solid" />
        <div className="mx-auto max-w-6xl p-6 md:p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-10 rounded-xl bg-slate-200" />
            <div className="h-72 rounded-xl bg-slate-200" />
            <div className="h-72 rounded-xl bg-slate-200" />
          </div>
        </div>
        <LandingFooter />
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-50">
        <LandingHeader variant="solid" />
        <div className="mx-auto max-w-2xl p-6 md:p-8">
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <Icon
              icon="heroicons:exclamation-circle"
              className="mx-auto mb-2 size-10 text-slate-400"
            />
            <p className="text-base font-semibold text-slate-900">
              {t("tourInstance.notFound", "Tour instance not found")}
            </p>
            <Link
              href="/tours"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
              <Icon icon="heroicons:arrow-left" className="size-4" />
              {t("landing.tourDetail.allTours", "All tours")}
            </Link>
          </div>
        </div>
        <LandingFooter />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <LandingHeader variant="solid" />

      <section className="mx-auto flex max-w-6xl flex-col gap-6 p-6 md:p-8">
        <header className="rounded-xl border border-slate-200 bg-white p-5">
          <Link
            href={`/tours/${data.tourId}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900">
            <Icon icon="heroicons:arrow-left" className="size-4" />
            {t("tourInstance.backToTour", "Back to tour")}
          </Link>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{data.title}</h1>
              <p className="text-sm text-slate-500">
                {data.tourName} • {data.tourInstanceCode}
              </p>
            </div>
            <StatusBadge status={data.status} />
          </div>
        </header>

        {heroImage && (
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <img
              src={heroImage}
              alt={data.title}
              className="h-[260px] w-full object-cover md:h-[360px]"
            />
          </section>
        )}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {t("tourInstance.location", "Location")}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{data.location || "—"}</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {t("tourInstance.startDate", "Start Date")}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{toDateText(data.startDate)}</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {t("tourInstance.endDate", "End Date")}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{toDateText(data.endDate)}</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {t("tourInstance.participants", "Participants")}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {data.currentParticipation}/{data.maxParticipation}
            </p>
          </article>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base font-bold text-slate-900">
            {t("tourInstance.userPricingBreakdown", "Pricing breakdown")}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-slate-500">{t("tourInstance.adultPrice", "Adult price")}</p>
              <p className="text-lg font-bold text-orange-600">{formatCurrency(data.basePrice)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">{t("tourInstance.childPrice", "Child price")}</p>
              <p className="text-lg font-bold text-orange-600">{formatCurrency(data.sellingPrice)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">{t("tourInstance.infantPrice", "Infant price")}</p>
              <p className="text-lg font-bold text-orange-600">{formatCurrency(data.operatingCost)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">{t("tourInstance.form.depositPerPerson", "Deposit per person")}</p>
              <p className="text-lg font-bold text-orange-600">{formatCurrency(data.depositPerPerson)}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-base font-bold text-slate-900">
              {t("tourInstance.guide", "Guide")}
            </h2>
            {data.guide ? (
              <div className="mt-4 space-y-2 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">{data.guide.name}</p>
                <p>
                  {t("tourInstance.languages", "Languages")}: {" "}
                  {data.guide.languages.join(", ") || "—"}
                </p>
                <p>
                  {t("tourInstance.experience", "Experience")}: {" "}
                  {data.guide.experience || "—"}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                {t("tourInstance.userNotAssigned", "Not assigned")}
              </p>
            )}
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-base font-bold text-slate-900">
              {t("tourInstance.includedServices", "Included Services")}
            </h2>
            {data.includedServices.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {data.includedServices.map((service) => (
                  <li
                    key={service}
                    className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                    {service}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-500">—</p>
            )}
          </article>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base font-bold text-slate-900">
            {t("tourInstance.dynamicPricing", "Dynamic Pricing")}
          </h2>
          {data.dynamicPricing.length > 0 ? (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="px-2 py-2">{t("tourInstance.form.minParticipants", "Min participants")}</th>
                    <th className="px-2 py-2">{t("tourInstance.form.maxParticipants", "Max participants")}</th>
                    <th className="px-2 py-2">{t("tourInstance.form.pricePerPerson", "Price per person")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.dynamicPricing.map((tier, index) => (
                    <tr
                      key={`${tier.minParticipants}-${tier.maxParticipants}-${index}`}
                      className="border-b border-slate-100">
                      <td className="px-2 py-2">{tier.minParticipants}</td>
                      <td className="px-2 py-2">{tier.maxParticipants}</td>
                      <td className="px-2 py-2 font-semibold text-orange-600">
                        {formatCurrency(tier.pricePerPerson)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">—</p>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base font-bold text-slate-900">
            {t("tourInstance.form.media", "Media")}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(data.images ?? []).length > 0 ? (
              data.images.map((image, index) => (
                <div
                  key={`${image.publicURL}-${index}`}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  {image.publicURL ? (
                    <img
                      src={image.publicURL}
                      alt={`${data.title} image ${index + 1}`}
                      className="h-36 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-36 items-center justify-center text-slate-400">
                      <Icon icon="heroicons:photo" className="size-6" />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">—</p>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base font-bold text-slate-900">
            {t("tourInstance.confirmationDeadline", "Confirmation Deadline")}
          </h2>
          <p className="mt-3 text-sm text-slate-700">
            {toDateText(data.confirmationDeadline)}
          </p>
        </section>
      </section>

      <LandingFooter />
    </main>
  );
}
