"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import Icon from "@/components/ui/Icon";
import { tourRequestService } from "@/services/tourRequestService";
import {
  TOUR_REQUEST_TRAVEL_INTERESTS,
  type CreateTourRequestPayload,
  type TourRequestTravelInterest,
} from "@/types/tourRequest";
import { handleApiError } from "@/utils/apiResponse";
import { LandingFooter } from "../shared/LandingFooter";
import { LandingHeader } from "../shared/LandingHeader";

type FormValues = {
  destination: string;
  startDate: string;
  endDate: string;
  numberOfParticipants: number;
  budgetPerPersonUsd: number | undefined;
  travelInterests: TourRequestTravelInterest[];
  preferredAccommodation: string;
  transportationPreference: string;
  specialRequests: string;
};

const travelInterestLabelKeys: Record<TourRequestTravelInterest, string> = {
  Adventure: "tourRequest.travelInterests.adventure",
  CultureAndHistory: "tourRequest.travelInterests.cultureAndHistory",
  NatureAndWildlife: "tourRequest.travelInterests.natureAndWildlife",
  FoodAndCulinary: "tourRequest.travelInterests.foodAndCulinary",
  RelaxationAndWellness: "tourRequest.travelInterests.relaxationAndWellness",
};

const defaultValues: FormValues = {
  destination: "",
  startDate: "",
  endDate: "",
  numberOfParticipants: 1,
  budgetPerPersonUsd: undefined,
  travelInterests: [],
  preferredAccommodation: "",
  transportationPreference: "",
  specialRequests: "",
};

export function CustomTourPage() {
  const { t } = useTranslation();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const validationSchema = useMemo(
    () =>
      yup.object({
        destination: yup
          .string()
          .required(t("tourRequest.validation.destinationRequired"))
          .max(500, t("tourRequest.validation.destinationMax")),
        startDate: yup
          .string()
          .required(t("tourRequest.validation.startDateRequired")),
        endDate: yup
          .string()
          .test(
            "endDateAfterStart",
            t("tourRequest.validation.endDateAfterStart"),
            (value, context) => {
              if (!value) {
                return true;
              }

              if (!context.parent.startDate) {
                return true;
              }

              return new Date(value) >= new Date(context.parent.startDate);
            },
          ),
        numberOfParticipants: yup
          .number()
          .typeError(t("tourRequest.validation.participantsRequired"))
          .required(t("tourRequest.validation.participantsRequired"))
          .min(1, t("tourRequest.validation.participantsMin")),
        budgetPerPersonUsd: yup
          .number()
          .transform((currentValue, originalValue) => {
            if (originalValue === "" || originalValue === null) {
              return undefined;
            }

            return currentValue;
          })
          .nullable()
          .notRequired()
          .moreThan(0, t("tourRequest.validation.budgetMin")),
        travelInterests: yup.array(yup.string().oneOf(TOUR_REQUEST_TRAVEL_INTERESTS)),
        preferredAccommodation: yup
          .string()
          .max(500, t("tourRequest.validation.preferredAccommodationMax")),
        transportationPreference: yup
          .string()
          .max(500, t("tourRequest.validation.transportationPreferenceMax")),
        specialRequests: yup
          .string()
          .max(2000, t("tourRequest.validation.specialRequestsMax")),
      }),
    [t],
  );

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(validationSchema) as never,
  });

  const selectedInterests = watch("travelInterests");

  const toggleTravelInterest = (interest: TourRequestTravelInterest) => {
    const currentInterests = selectedInterests ?? [];
    const nextInterests = currentInterests.includes(interest)
      ? currentInterests.filter((item) => item !== interest)
      : [...currentInterests, interest];

    setValue("travelInterests", nextInterests, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const payload: CreateTourRequestPayload = {
        destination: values.destination.trim(),
        startDate: values.startDate,
        endDate: values.endDate || null,
        numberOfParticipants: values.numberOfParticipants,
        budgetPerPersonUsd: values.budgetPerPersonUsd
          ? Number(values.budgetPerPersonUsd)
          : null,
        travelInterests: values.travelInterests,
        preferredAccommodation: values.preferredAccommodation.trim() || null,
        transportationPreference: values.transportationPreference.trim() || null,
        specialRequests: values.specialRequests.trim() || null,
      };

      await tourRequestService.createTourRequest(payload);

      setHasSubmitted(true);
      reset(defaultValues);

      toast.success(
        <span>
          {t("tourRequest.toast.createSuccess")}{" "}
          <Link href="/tours/my-requests" className="underline font-semibold">
            {t("tourRequest.form.viewMyRequests")}
          </Link>
        </span>,
      );
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(
        t(apiError.message, {
          defaultValue: t("tourRequest.toast.createError"),
        }),
      );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen">
      <LandingHeader />

      <section className="relative bg-gradient-to-br from-[#05073c] via-[#1a1c5e] to-[#05073c] text-white py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#fa8b02] rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-[#eb662b] rounded-full blur-[150px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
          >
            <Icon icon="heroicons:arrow-left" className="w-4 h-4" />
            <span className="text-sm">{t("landing.customTour.backToHome")}</span>
          </Link>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">
            {t("tourRequest.page.customTour.title")}
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            {t("tourRequest.page.customTour.subtitle")}
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t("tourRequest.page.customTour.title")}
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            {t("landing.customTour.intro")}
          </p>

          {hasSubmitted && (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 text-sm">
              {t("tourRequest.toast.createSuccess")}{" "}
              <Link href="/tours/my-requests" className="font-semibold underline">
                {t("tourRequest.form.viewMyRequests")}
              </Link>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label
                  htmlFor="destination"
                  className="block text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2"
                >
                  {t("tourRequest.form.destination")}
                </label>
                <input
                  id="destination"
                  type="text"
                  maxLength={500}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  {...register("destination")}
                />
                {errors.destination?.message && (
                  <p className="mt-1 text-sm text-rose-600">{errors.destination.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2"
                >
                  {t("tourRequest.form.startDate")}
                </label>
                <input
                  id="startDate"
                  type="date"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  {...register("startDate")}
                />
                {errors.startDate?.message && (
                  <p className="mt-1 text-sm text-rose-600">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2"
                >
                  {t("tourRequest.form.endDate")}
                </label>
                <input
                  id="endDate"
                  type="date"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  {...register("endDate")}
                />
                {errors.endDate?.message && (
                  <p className="mt-1 text-sm text-rose-600">{errors.endDate.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="numberOfParticipants"
                  className="block text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2"
                >
                  {t("tourRequest.form.numberOfParticipants")}
                </label>
                <input
                  id="numberOfParticipants"
                  type="number"
                  min={1}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  {...register("numberOfParticipants", { valueAsNumber: true })}
                />
                {errors.numberOfParticipants?.message && (
                  <p className="mt-1 text-sm text-rose-600">
                    {errors.numberOfParticipants.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="budgetPerPersonUsd"
                  className="block text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2"
                >
                  {t("tourRequest.form.budgetPerPerson")}
                </label>
                <input
                  id="budgetPerPersonUsd"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="500"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  {...register("budgetPerPersonUsd", { valueAsNumber: true })}
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {t("tourRequest.form.budgetHint")}
                </p>
                {errors.budgetPerPersonUsd?.message && (
                  <p className="mt-1 text-sm text-rose-600">{errors.budgetPerPersonUsd.message}</p>
                )}
              </div>
            </div>

            <div>
              <p className="block text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
                {t("tourRequest.form.travelInterests")}
              </p>
              <div className="flex flex-wrap gap-2">
                {TOUR_REQUEST_TRAVEL_INTERESTS.map((interest) => {
                  const selected = selectedInterests.includes(interest);

                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleTravelInterest(interest)}
                      className={`px-3 py-2 rounded-full border text-sm transition-colors ${
                        selected
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-orange-400"
                      }`}
                    >
                      {t(travelInterestLabelKeys[interest])}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label
                  htmlFor="preferredAccommodation"
                  className="block text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2"
                >
                  {t("tourRequest.form.preferredAccommodation")}
                </label>
                <input
                  id="preferredAccommodation"
                  type="text"
                  maxLength={500}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  {...register("preferredAccommodation")}
                />
                {errors.preferredAccommodation?.message && (
                  <p className="mt-1 text-sm text-rose-600">
                    {errors.preferredAccommodation.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="transportationPreference"
                  className="block text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2"
                >
                  {t("tourRequest.form.transportationPreference")}
                </label>
                <input
                  id="transportationPreference"
                  type="text"
                  maxLength={500}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  {...register("transportationPreference")}
                />
                {errors.transportationPreference?.message && (
                  <p className="mt-1 text-sm text-rose-600">
                    {errors.transportationPreference.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="specialRequests"
                  className="block text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2"
                >
                  {t("tourRequest.form.specialRequests")}
                </label>
                <textarea
                  id="specialRequests"
                  rows={4}
                  maxLength={2000}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  {...register("specialRequests")}
                />
                {errors.specialRequests?.message && (
                  <p className="mt-1 text-sm text-rose-600">{errors.specialRequests.message}</p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting && (
                  <Icon icon="heroicons:arrow-path" className="w-5 h-5 animate-spin" />
                )}
                <span>
                  {isSubmitting
                    ? t("tourRequest.form.submitting")
                    : t("tourRequest.form.submit")}
                </span>
              </button>
            </div>
          </form>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
