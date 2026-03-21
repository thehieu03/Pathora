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
import {
  GearSix,
  Calculator,
  CurrencyDollar,
  ClipboardText,
  FileText,
  Bank,
  Bell,
  ShieldCheck,
  CreditCard,
  PuzzlePiece,
} from "@phosphor-icons/react";

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

const VALID_TAB_IDS = [
  "general", "tax-configs", "pricing-policies", "policies", "visa-policies",
  "deposit-policies", "notifications", "security", "billing", "integrations",
];

const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

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

function SettingsNavItem({
  tabId,
  label,
  isActive,
  onClick,
  index,
}: {
  tabId: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.button
      key={tabId}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...springTransition, delay: index * 0.03 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset ${
        isActive
          ? "bg-primary text-white"
          : "text-stone-500 hover:text-stone-800 hover:bg-stone-100 active:scale-[0.98]"
      }`}
    >
      {isActive ? (
        <motion.div
          layoutId="settings-nav-indicator"
          className="size-[18px] shrink-0 flex items-center justify-center"
          transition={springTransition}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-white" />
        </motion.div>
      ) : null}
      <span className="truncate">{label}</span>
    </motion.button>
  );
}

const TEAM_MEMBERS = [
  { id: "1", name: "Admin User", email: "admin@pathora.com", role: "Owner", status: "active" },
  { id: "2", name: "Sales Manager", email: "sales@pathora.com", role: "Admin", status: "active" },
  { id: "3", name: "Support Agent", email: "support@pathora.com", role: "Editor", status: "active" },
  { id: "4", name: "Content Writer", email: "content@pathora.com", role: "Viewer", status: "pending" },
];

const NOTIFICATION_PREFERENCES = [
  { id: "email-bookings", label: "settings.notifications.emailBookings", desc: "settings.notifications.emailBookingsDesc", enabled: true },
  { id: "payment-reminders", label: "settings.notifications.paymentReminders", desc: "settings.notifications.paymentRemindersDesc", enabled: true },
  { id: "visa-updates", label: "settings.notifications.visaUpdates", desc: "settings.notifications.visaUpdatesDesc", enabled: true },
  { id: "tour-reminders", label: "settings.notifications.tourReminders", desc: "settings.notifications.tourRemindersDesc", enabled: false },
  { id: "weekly-reports", label: "settings.notifications.weeklyReports", desc: "settings.notifications.weeklyReportsDesc", enabled: true },
  { id: "marketing", label: "settings.notifications.marketing", desc: "settings.notifications.marketingDesc", enabled: false },
];

const INTEGRATIONS = [
  { name: "settings.integrations.paymentGateway", desc: "settings.integrations.paymentGatewayDesc", icon: CreditCard, connected: true },
  { name: "settings.integrations.emailService", desc: "settings.integrations.emailServiceDesc", icon: FileText, connected: true },
  { name: "settings.integrations.smsNotifications", desc: "settings.integrations.smsNotificationsDesc", icon: GearSix, connected: false },
  { name: "settings.integrations.analytics", desc: "settings.integrations.analyticsDesc", icon: Calculator, connected: true },
  { name: "settings.integrations.crmIntegration", desc: "settings.integrations.crmIntegrationDesc", icon: PuzzlePiece, connected: false },
];

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-5.5 rounded-full transition-colors duration-300 active:scale-95 ${
        enabled ? "bg-primary" : "bg-stone-200"
      }`}
    >
      <motion.span
        className="absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm"
        animate={{ x: enabled ? 18 : 0 }}
        transition={springTransition}
      />
    </button>
  );
}

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    Owner: { bg: "bg-amber-50", text: "text-amber-700" },
    Admin: { bg: "bg-blue-50", text: "text-blue-700" },
    Editor: { bg: "bg-emerald-50", text: "text-emerald-700" },
    Viewer: { bg: "bg-stone-100", text: "text-stone-600" },
  };
  const style = map[role] || map["Viewer"];
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
      {role}
    </span>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[2rem] border border-border shadow-card overflow-hidden">
      {children}
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="px-8 pt-6 pb-4 border-b border-border">
      <h3 className="text-lg font-bold text-stone-900 tracking-tight">{title}</h3>
      <p className="mt-1 text-xs text-stone-400 font-medium uppercase tracking-widest">{subtitle}</p>
    </div>
  );
}

export function SettingsPage() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: t("settings.tabs.general"), icon: GearSix },
    { id: "tax-configs", label: t("settings.tabs.taxConfigs"), icon: Calculator },
    { id: "pricing-policies", label: t("settings.tabs.pricingPolicies"), icon: CurrencyDollar },
    { id: "policies", label: t("settings.tabs.policies"), icon: ClipboardText },
    { id: "visa-policies", label: t("settings.tabs.visaPolicies"), icon: FileText },
    { id: "deposit-policies", label: t("settings.tabs.depositPolicies"), icon: Bank },
    { id: "notifications", label: t("settings.tabs.notifications"), icon: Bell },
    { id: "security", label: t("settings.tabs.security"), icon: ShieldCheck },
    { id: "billing", label: t("settings.tabs.billing"), icon: CreditCard },
    { id: "integrations", label: t("settings.tabs.integrations"), icon: PuzzlePiece },
  ];

  return (
    <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
      <Suspense fallback={null}>
        <TabUrlSync onTabChange={setActiveTab} />
      </Suspense>
      <TopBar onMenuClick={() => setSidebarOpen(true)} />
      <main id="main-content" className="px-4 pb-16 pt-4 lg:px-8 max-w-[1400px] mx-auto w-full">
        {/* Page Header */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springTransition}
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-primary" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                  {t("settings.pageTitle")}
                </h1>
                <p className="mt-1 text-sm text-stone-500">{t("settings.pageSubtitle")}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sidebar nav */}
          <div className="order-2 lg:order-1">
            <Card bodyClass="!p-2">
              <nav className="space-y-0.5">
                {tabs.map((tab, index) => {
                  const isActive = activeTab === tab.id;
                  const IconComponent = tab.icon;
                  return (
                    <SettingsNavItem
                      key={tab.id}
                      tabId={tab.id}
                      label={tab.label}
                      isActive={isActive}
                      onClick={() => setActiveTab(tab.id)}
                      index={index}
                    />
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Content area */}
          <div className="order-1 lg:order-2 space-y-6">
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
                  {/* Organization card */}
                  <SectionCard>
                    <SectionHeader title={t("settings.general.organization")} subtitle="Company profile" />
                    <div className="px-8 py-6 space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-stone-700">{t("settings.general.companyName")}</label>
                        <input
                          type="text"
                          defaultValue="Pathora"
                          className="w-full rounded-2xl border border-border bg-stone-50/60 px-4 py-2.5 text-sm text-stone-700 transition-all duration-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-stone-700">{t("settings.general.businessEmail")}</label>
                        <input
                          type="email"
                          defaultValue="contact@pathora.com"
                          className="w-full rounded-2xl border border-border bg-stone-50/60 px-4 py-2.5 text-sm text-stone-700 transition-all duration-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="block text-sm font-semibold text-stone-700">{t("settings.general.timezone")}</label>
                          <select className="w-full rounded-2xl border border-border bg-stone-50/60 px-4 py-2.5 text-sm text-stone-700 transition-all duration-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15">
                            <option>Asia/Ho_Chi_Minh (GMT+7)</option>
                            <option>Asia/Tokyo (GMT+9)</option>
                            <option>Asia/Seoul (GMT+9)</option>
                            <option>UTC (GMT+0)</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-sm font-semibold text-stone-700">{t("settings.general.currency")}</label>
                          <select className="w-full rounded-2xl border border-border bg-stone-50/60 px-4 py-2.5 text-sm text-stone-700 transition-all duration-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15">
                            <option>USD ($)</option>
                            <option>VND</option>
                            <option>EUR</option>
                            <option>JPY</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="px-8 pb-6 pt-4 border-t border-border">
                      <Button className="bg-stone-900 text-white hover:bg-stone-800 active:scale-[0.98] transition-all">
                        {t("settings.general.saveChanges")}
                      </Button>
                    </div>
                  </SectionCard>

                  {/* Team members */}
                  <SectionCard>
                    <SectionHeader title={t("settings.teamMembers.title")} subtitle={`${TEAM_MEMBERS.length} members`} />
                    <div className="divide-y divide-border">
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
                              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-sm font-bold text-amber-600">
                                {member.name.split(" ").map((n) => n[0]).join("")}
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
                            <RoleBadge role={member.status === "pending" ? "Viewer" : member.role} />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="px-8 pb-6 pt-4 border-t border-border">
                      <Button className="border border-border text-stone-600 bg-white hover:bg-stone-50 active:scale-[0.98] transition-all">
                        {t("settings.teamMembers.inviteMember")}
                      </Button>
                    </div>
                  </SectionCard>
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
                  <SectionCard>
                    <SectionHeader title={t("settings.notifications.title")} subtitle="Preferences" />
                    <div className="divide-y divide-border">
                      {NOTIFICATION_PREFERENCES.map((item, i) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ ...springTransition, delay: i * 0.04 }}
                          className="flex items-center justify-between px-8 py-4"
                        >
                          <div>
                            <p className="text-sm font-medium text-stone-900">{t(item.label)}</p>
                            <p className="text-xs text-stone-500 mt-0.5">{t(item.desc)}</p>
                          </div>
                          <ToggleSwitch
                            enabled={item.enabled}
                            onChange={() => {}}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </SectionCard>
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={springTransition}
                >
                  <SectionCard>
                    <SectionHeader title={t("settings.security.title")} subtitle="Account security" />
                    <div className="px-8 py-6 space-y-6">
                      <div>
                        <h4 className="text-sm font-semibold text-stone-700 mb-3">{t("settings.security.changePassword")}</h4>
                        <div className="space-y-3 max-w-md">
                          <input
                            type="password"
                            placeholder={t("common.auth.currentPassword")}
                            className="w-full rounded-2xl border border-border bg-stone-50/60 px-4 py-2.5 text-sm transition-all duration-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
                          />
                          <input
                            type="password"
                            placeholder={t("common.auth.newPassword")}
                            className="w-full rounded-2xl border border-border bg-stone-50/60 px-4 py-2.5 text-sm transition-all duration-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
                          />
                          <input
                            type="password"
                            placeholder={t("common.auth.confirmPassword")}
                            className="w-full rounded-2xl border border-border bg-stone-50/60 px-4 py-2.5 text-sm transition-all duration-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
                          />
                        </div>
                        <Button className="mt-4 bg-stone-900 text-white hover:bg-stone-800 active:scale-[0.98] transition-all">
                          {t("settings.security.changePassword")}
                        </Button>
                      </div>
                      <div className="pt-5 border-t border-border">
                        <h4 className="text-sm font-semibold text-stone-700 mb-1">{t("settings.security.twoFactor")}</h4>
                        <p className="text-xs text-stone-500 mb-3">{t("settings.security.twoFactorDesc")}</p>
                        <Button className="border border-border text-stone-600 bg-white hover:bg-stone-50 active:scale-[0.98] transition-all">
                          {t("settings.security.enable2FA")}
                        </Button>
                      </div>
                      <div className="pt-5 border-t border-border">
                        <h4 className="text-sm font-semibold text-stone-700 mb-3">{t("settings.security.activeSessions")}</h4>
                        <div className="space-y-2 max-w-md">
                          <div className="flex items-center justify-between py-3 px-4 rounded-2xl bg-stone-50/80 border border-border">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center">
                                <GearSix className="size-4 text-stone-400" weight="bold" />
                              </div>
                              <span className="text-sm text-stone-700">{t("settings.security.chromeWindows")}</span>
                            </div>
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                              {t("settings.security.currentSession")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SectionCard>
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
                  <SectionCard>
                    {/* Plan header */}
                    <div className="bg-stone-900 px-8 py-8 text-white">
                      <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary blur-3xl" />
                      </div>
                      <div className="relative">
                        <p className="text-xs font-medium uppercase tracking-widest text-stone-400">{t("settings.billing.title")}</p>
                        <p className="mt-2 text-3xl font-bold tracking-tight">{t("settings.billing.plan")}</p>
                        <p className="mt-1 text-sm text-stone-400">{t("settings.billing.renewsOn")}</p>
                      </div>
                    </div>
                    {/* Usage metrics */}
                    <div className="divide-y divide-border">
                      {[
                        { label: "settings.billing.apiCalls", value: "8,450 / 10,000", percent: "84.5%" },
                        { label: "settings.billing.storageUsed", value: "2.4 / 10 GB", percent: "24%" },
                        { label: "settings.teamMembers.title", value: "4 / 10", percent: "40%" },
                      ].map((metric, idx) => (
                        <div key={idx} className="flex items-center justify-between px-8 py-4">
                          <span className="text-sm text-stone-600">{t(metric.label)}</span>
                          <div className="flex items-center gap-3">
                            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-stone-100">
                              <motion.div
                                className="h-full rounded-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: metric.percent }}
                                transition={{ ...springTransition, delay: 0.1 + idx * 0.1 }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-stone-900 tabular-nums">{metric.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 px-8 py-6 border-t border-border">
                      <Button className="bg-stone-900 text-white hover:bg-stone-800 active:scale-[0.98] transition-all">
                        {t("settings.billing.upgradePlan")}
                      </Button>
                      <Button className="border border-border text-stone-600 bg-white hover:bg-stone-50 active:scale-[0.98] transition-all">
                        {t("settings.billing.viewInvoices")}
                      </Button>
                    </div>
                  </SectionCard>
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
                  {INTEGRATIONS.map((integration, i) => {
                    const IconComponent = integration.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...springTransition, delay: i * 0.06 }}
                        className="flex items-center justify-between rounded-[2rem] bg-white border border-border px-6 py-4 shadow-card"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                            integration.connected ? "bg-emerald-50" : "bg-stone-100"
                          }`}>
                            <IconComponent className={`size-5 ${integration.connected ? "text-emerald-600" : "text-stone-400"}`} weight="duotone" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-stone-900">{t(integration.name)}</p>
                            <p className="text-xs text-stone-500">{t(integration.desc)}</p>
                          </div>
                        </div>
                        <Button
                          className={integration.connected
                            ? "border border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 active:scale-[0.98] transition-all text-xs"
                            : "bg-stone-900 text-white hover:bg-stone-800 active:scale-[0.98] transition-all text-xs"
                          }
                        >
                          {integration.connected ? t("settings.integrations.connected") : t("settings.integrations.connect")}
                        </Button>
                      </motion.div>
                    );
                  })}
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
