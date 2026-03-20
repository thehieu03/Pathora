"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Icon } from "@/components/ui";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { AdminSidebar, TopBar } from "./AdminSidebar";

// Lazy load pricing, tax, and policy components
const TaxConfigsPage = dynamic(
  () => import("@/features/dashboard/components/TaxConfigsPage").then((mod) => mod.TaxConfigsPage),
  { ssr: false },
);
const PricingPoliciesPage = dynamic(
  () => import("@/features/dashboard/components/PricingPoliciesPage").then((mod) => mod.PricingPoliciesPage),
  { ssr: false },
);
const DashboardPoliciesPage = dynamic(
  () => import("@/features/dashboard/components/DashboardPoliciesPage").then((mod) => mod.DashboardPoliciesPage),
  { ssr: false },
);
const VisaPoliciesPage = dynamic(
  () => import("@/features/dashboard/components/VisaPoliciesPage").then((mod) => mod.VisaPoliciesPage),
  { ssr: false },
);
const DepositPoliciesSettings = dynamic(
  () => import("@/features/dashboard/components/DepositPoliciesSettings").then((mod) => mod.DepositPoliciesSettings),
  { ssr: false },
);

const SETTINGS_TABS = (t: (key: string) => string) => [
  { id: "general", label: t("settings.tabs.general"), icon: "heroicons:cog-6-tooth" },
  { id: "tax-configs", label: t("settings.tabs.taxConfigs"), icon: "heroicons:calculator" },
  { id: "pricing-policies", label: t("settings.tabs.pricingPolicies"), icon: "heroicons:currency-dollar" },
  { id: "policies", label: t("settings.tabs.policies"), icon: "heroicons:clipboard-document-list" },
  { id: "visa-policies", label: t("settings.tabs.visaPolicies"), icon: "heroicons:document-text" },
  { id: "deposit-policies", label: t("settings.tabs.depositPolicies"), icon: "heroicons:banknotes" },
  { id: "notifications", label: t("settings.tabs.notifications"), icon: "heroicons:bell" },
  { id: "security", label: t("settings.tabs.security"), icon: "heroicons:shield-check" },
  { id: "billing", label: t("settings.tabs.billing"), icon: "heroicons:credit-card" },
  { id: "integrations", label: t("settings.tabs.integrations"), icon: "heroicons:puzzle-piece" },
];

const TEAM_MEMBERS = [
  { id: "1", name: "Admin User", email: "admin@pathora.com", role: "Owner", status: "active" },
  { id: "2", name: "Sales Manager", email: "sales@pathora.com", role: "Admin", status: "active" },
  { id: "3", name: "Support Agent", email: "support@pathora.com", role: "Editor", status: "active" },
  { id: "4", name: "Content Writer", email: "content@pathora.com", role: "Viewer", status: "pending" },
];

const VALID_TAB_IDS = [
  "general", "tax-configs", "pricing-policies", "policies", "visa-policies",
  "deposit-policies", "notifications", "security", "billing", "integrations",
];

function TabUrlSync({ onTabChange }: { onTabChange: (tab: string) => void }) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  useEffect(() => {
    if (tab && VALID_TAB_IDS.includes(tab)) {
      onTabChange(tab);
    }
  }, [tab, onTabChange]);

  return null;
}

const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

export function SettingsPage() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  return (
    <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
      <Suspense fallback={null}>
        <TabUrlSync onTabChange={setActiveTab} />
      </Suspense>
      <TopBar onMenuClick={() => setSidebarOpen(true)} />
      <main id="main-content" className="px-4 pb-12 pt-4 lg:px-8">
        {/* Header */}
        <div className="mb-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springTransition}
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-gradient-to-b from-amber-400 to-amber-600" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                  {t("settings.pageTitle")}
                </h1>
                <p className="mt-1 text-sm text-stone-500">{t("settings.pageSubtitle")}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr] xl:grid-cols-[240px_1fr]">
          {/* Sidebar nav */}
          <div className="order-2 lg:order-1">
            <Card bodyClass="!p-2">
              <nav className="space-y-0.5">
                {SETTINGS_TABS(t).map((tab, index) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...springTransition, delay: index * 0.03 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-inset ${
                        isActive
                          ? "bg-stone-900 text-white"
                          : "text-stone-500 hover:text-stone-800 hover:bg-stone-100 active:scale-[0.98]"
                      }`}
                    >
                      <Icon icon={tab.icon} className="size-[18px] shrink-0" />
                      <span className="truncate">{tab.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="settings-nav-indicator"
                          className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400"
                          transition={springTransition}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Content area */}
          <div className="order-1 lg:order-2">
            <AnimatePresence mode="wait">
              {activeTab === "general" && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={springTransition}
                  className="space-y-6"
                >
                  {/* Organization card — left-offset accent */}
                  <div className="relative overflow-hidden rounded-[2.5rem] border border-stone-200/50 bg-white p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                    <div className="absolute -left-px top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600" />
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                        {t("settings.general.organization")}
                      </h3>
                      <p className="mt-1 text-xs text-stone-400 font-medium uppercase tracking-widest">
                        Company profile
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-stone-700">{t("settings.general.companyName")}</label>
                        <input type="text" defaultValue="Pathora" className="w-full rounded-2xl border border-stone-200/80 bg-stone-50/60 px-4 py-2.5 text-sm text-stone-700 transition-all duration-200 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/15" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-stone-700">{t("settings.general.businessEmail")}</label>
                        <input type="email" defaultValue="contact@pathora.com" className="w-full rounded-2xl border border-stone-200/80 bg-stone-50/60 px-4 py-2.5 text-sm text-stone-700 transition-all duration-200 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/15" />
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="block text-sm font-semibold text-stone-700">{t("settings.general.timezone")}</label>
                          <select className="w-full rounded-2xl border border-stone-200/80 bg-stone-50/60 px-4 py-2.5 text-sm text-stone-700 transition-all duration-200 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/15">
                            <option>Asia/Ho_Chi_Minh (GMT+7)</option>
                            <option>Asia/Tokyo (GMT+9)</option>
                            <option>Asia/Seoul (GMT+9)</option>
                            <option>UTC (GMT+0)</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-sm font-semibold text-stone-700">{t("settings.general.currency")}</label>
                          <select className="w-full rounded-2xl border border-stone-200/80 bg-stone-50/60 px-4 py-2.5 text-sm text-stone-700 transition-all duration-200 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/15">
                            <option>USD ($)</option>
                            <option>VND</option>
                            <option>EUR</option>
                            <option>JPY</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-5 border-t border-stone-100">
                      <Button className="bg-stone-900 text-white hover:bg-stone-800 active:scale-[0.98] transition-all">{t("settings.general.saveChanges")}</Button>
                    </div>
                  </div>

                  {/* Team members — asymmetric layout */}
                  <div className="overflow-hidden rounded-[2.5rem] border border-stone-200/50 bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                    <div className="bg-stone-50/80 px-8 pt-6 pb-4">
                      <h3 className="text-lg font-bold text-stone-900 tracking-tight">{t("settings.teamMembers.title")}</h3>
                      <p className="mt-1 text-xs text-stone-400 font-medium uppercase tracking-widest">
                        {TEAM_MEMBERS.length} members
                      </p>
                    </div>
                    <div className="divide-y divide-stone-100">
                      {TEAM_MEMBERS.map((member, index) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ ...springTransition, delay: index * 0.05 }}
                          className="flex items-center justify-between px-8 py-4 hover:bg-stone-50/60 transition-colors duration-150"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 text-sm font-bold text-amber-600">
                                {member.name.split(" ").map(n => n[0]).join("")}
                              </div>
                              {member.status === "active" && (
                                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-stone-900">{member.name}</p>
                              <p className="text-xs text-stone-500">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              member.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                            }`}>
                              {member.status === "active" ? t("settings.teamMembers.active") : t("settings.teamMembers.pending")}
                            </span>
                            <span className="text-xs text-stone-400 font-medium">{t(`settings.teamMembers.${member.role.toLowerCase()}` as never) || member.role}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="px-8 pb-6 pt-4">
                      <Button className="border border-stone-200 text-stone-600 bg-white hover:bg-stone-50 active:scale-[0.98] transition-all">{t("settings.teamMembers.inviteMember")}</Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "tax-configs" && (
                <motion.div key="tax-configs" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={springTransition}>
                  <TaxConfigsPage />
                </motion.div>
              )}

              {activeTab === "pricing-policies" && (
                <motion.div key="pricing-policies" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={springTransition}>
                  <PricingPoliciesPage />
                </motion.div>
              )}

              {activeTab === "policies" && (
                <motion.div key="policies" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={springTransition}>
                  <DashboardPoliciesPage />
                </motion.div>
              )}

              {activeTab === "visa-policies" && (
                <motion.div key="visa-policies" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={springTransition}>
                  <VisaPoliciesPage />
                </motion.div>
              )}

              {activeTab === "deposit-policies" && (
                <motion.div key="deposit-policies" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={springTransition}>
                  <DepositPoliciesSettings />
                </motion.div>
              )}

              {activeTab === "notifications" && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={springTransition}
                >
                  <div className="overflow-hidden rounded-[2.5rem] border border-stone-200/50 bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                    <div className="bg-stone-50/80 px-8 pt-6 pb-4">
                      <h3 className="text-lg font-bold text-stone-900 tracking-tight">{t("settings.notifications.title")}</h3>
                      <p className="mt-1 text-xs text-stone-400 font-medium uppercase tracking-widest">Preferences</p>
                    </div>
                    <div className="divide-y divide-stone-100">
                      {[
                        { label: "settings.notifications.emailBookings", desc: "settings.notifications.emailBookingsDesc", enabled: true },
                        { label: "settings.notifications.paymentReminders", desc: "settings.notifications.paymentRemindersDesc", enabled: true },
                        { label: "settings.notifications.visaUpdates", desc: "settings.notifications.visaUpdatesDesc", enabled: true },
                        { label: "settings.notifications.tourReminders", desc: "settings.notifications.tourRemindersDesc", enabled: false },
                        { label: "settings.notifications.weeklyReports", desc: "settings.notifications.weeklyReportsDesc", enabled: true },
                        { label: "settings.notifications.marketing", desc: "settings.notifications.marketingDesc", enabled: false },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ ...springTransition, delay: i * 0.04 }}
                          className="flex items-center justify-between px-8 py-4"
                        >
                          <div>
                            <p className="text-sm font-medium text-stone-900">{t(item.label)}</p>
                            <p className="text-xs text-stone-500 mt-0.5">{t(item.desc)}</p>
                          </div>
                          <button
                            className={`relative w-11 h-6 rounded-full transition-colors duration-300 active:scale-95 ${
                              item.enabled ? "bg-amber-500" : "bg-stone-200"
                            }`}
                          >
                            <motion.span
                              className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                              animate={{ x: item.enabled ? 20 : 0 }}
                              transition={springTransition}
                            />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={springTransition}
                  className="space-y-6"
                >
                  <div className="overflow-hidden rounded-[2.5rem] border border-stone-200/50 bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                    <div className="bg-stone-50/80 px-8 pt-6 pb-4">
                      <h3 className="text-lg font-bold text-stone-900 tracking-tight">{t("settings.security.title")}</h3>
                      <p className="mt-1 text-xs text-stone-400 font-medium uppercase tracking-widest">Account security</p>
                    </div>
                    <div className="px-8 py-6 space-y-6">
                      <div>
                        <h4 className="text-sm font-semibold text-stone-700 mb-3">{t("settings.security.changePassword")}</h4>
                        <div className="space-y-3 max-w-md">
                          <input type="password" placeholder={t("common.auth.currentPassword")} className="w-full rounded-2xl border border-stone-200/80 bg-stone-50/60 px-4 py-2.5 text-sm transition-all duration-200 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/15" />
                          <input type="password" placeholder={t("common.auth.newPassword")} className="w-full rounded-2xl border border-stone-200/80 bg-stone-50/60 px-4 py-2.5 text-sm transition-all duration-200 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/15" />
                          <input type="password" placeholder={t("common.auth.confirmPassword")} className="w-full rounded-2xl border border-stone-200/80 bg-stone-50/60 px-4 py-2.5 text-sm transition-all duration-200 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/15" />
                        </div>
                        <Button className="mt-4 bg-stone-900 text-white hover:bg-stone-800 active:scale-[0.98] transition-all">{t("settings.security.changePassword")}</Button>
                      </div>
                      <div className="pt-5 border-t border-stone-100">
                        <h4 className="text-sm font-semibold text-stone-700 mb-1">{t("settings.security.twoFactor")}</h4>
                        <p className="text-xs text-stone-500 mb-3">{t("settings.security.twoFactorDesc")}</p>
                        <Button className="border border-stone-200 text-stone-600 bg-white hover:bg-stone-50 active:scale-[0.98] transition-all">{t("settings.security.enable2FA")}</Button>
                      </div>
                      <div className="pt-5 border-t border-stone-100">
                        <h4 className="text-sm font-semibold text-stone-700 mb-3">{t("settings.security.activeSessions")}</h4>
                        <div className="space-y-2 max-w-md">
                          <div className="flex items-center justify-between py-3 px-4 rounded-2xl bg-stone-50/80 border border-stone-100">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center">
                                <Icon icon="heroicons:computer-desktop" className="size-4 text-stone-400" />
                              </div>
                              <span className="text-sm text-stone-700">{t("settings.security.chromeWindows")}</span>
                            </div>
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{t("settings.security.currentSession")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "billing" && (
                <motion.div
                  key="billing"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={springTransition}
                >
                  <div className="overflow-hidden rounded-[2.5rem] border border-stone-200/50 bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                    {/* Plan header — accent block */}
                    <div className="relative bg-stone-900 px-8 py-8 text-white">
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-amber-500 blur-3xl" />
                      </div>
                      <div className="relative">
                        <p className="text-xs font-medium uppercase tracking-widest text-stone-400">{t("settings.billing.title")}</p>
                        <p className="mt-2 text-3xl font-bold tracking-tight">{t("settings.billing.plan")}</p>
                        <p className="mt-1 text-sm text-stone-400">{t("settings.billing.renewsOn")}</p>
                      </div>
                    </div>
                    {/* Usage metrics */}
                    <div className="divide-y divide-stone-100">
                      <div className="flex items-center justify-between px-8 py-4">
                        <span className="text-sm text-stone-600">{t("settings.billing.apiCalls")}</span>
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-stone-100">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
                              initial={{ width: 0 }}
                              animate={{ width: "84.5%" }}
                              transition={{ ...springTransition, delay: 0.2 }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-stone-900 tabular-nums">8,450 / 10,000</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-8 py-4">
                        <span className="text-sm text-stone-600">{t("settings.billing.storageUsed")}</span>
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-stone-100">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
                              initial={{ width: 0 }}
                              animate={{ width: "24%" }}
                              transition={{ ...springTransition, delay: 0.3 }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-stone-900 tabular-nums">2.4 / 10 GB</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-8 py-4">
                        <span className="text-sm text-stone-600">{t("settings.teamMembers.title")}</span>
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-stone-100">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
                              initial={{ width: 0 }}
                              animate={{ width: "40%" }}
                              transition={{ ...springTransition, delay: 0.4 }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-stone-900 tabular-nums">4 / 10</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 px-8 py-6">
                      <Button className="bg-stone-900 text-white hover:bg-stone-800 active:scale-[0.98] transition-all">{t("settings.billing.upgradePlan")}</Button>
                      <Button className="border border-stone-200 text-stone-600 bg-white hover:bg-stone-50 active:scale-[0.98] transition-all">{t("settings.billing.viewInvoices")}</Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "integrations" && (
                <motion.div
                  key="integrations"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={springTransition}
                  className="space-y-3"
                >
                  {[
                    { name: "settings.integrations.paymentGateway", desc: "settings.integrations.paymentGatewayDesc", icon: "heroicons:credit-card", connected: true },
                    { name: "settings.integrations.emailService", desc: "settings.integrations.emailServiceDesc", icon: "heroicons:envelope", connected: true },
                    { name: "settings.integrations.smsNotifications", desc: "settings.integrations.smsNotificationsDesc", icon: "heroicons:device-phone-mobile", connected: false },
                    { name: "settings.integrations.analytics", desc: "settings.integrations.analyticsDesc", icon: "heroicons:chart-bar", connected: true },
                    { name: "settings.integrations.crmIntegration", desc: "settings.integrations.crmIntegrationDesc", icon: "heroicons:user-group", connected: false },
                  ].map((integration, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...springTransition, delay: i * 0.06 }}
                      className="flex items-center justify-between rounded-[2rem] bg-white border border-stone-200/50 px-6 py-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                          integration.connected ? "bg-emerald-50" : "bg-stone-100"
                        }`}>
                          <Icon icon={integration.icon} className={`size-5 ${integration.connected ? "text-emerald-600" : "text-stone-400"}`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-stone-900">{t(integration.name)}</p>
                          <p className="text-xs text-stone-500">{t(integration.desc)}</p>
                        </div>
                      </div>
                      <Button className={integration.connected ? "border border-emerald-300 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 active:scale-[0.98] transition-all text-xs" : "bg-stone-900 text-white hover:bg-stone-800 active:scale-[0.98] transition-all text-xs"}>
                        {integration.connected ? t("settings.integrations.connected") : t("settings.integrations.connect")}
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </AdminSidebar>
  );
}

export default SettingsPage;
