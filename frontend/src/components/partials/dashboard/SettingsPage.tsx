"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { AdminLogoutButton } from "./AdminLogoutButton";

/* ══════════════════════════════════════════════════════════════
   Sidebar Navigation
   ══════════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { label: "Dashboard", icon: "heroicons:squares-2x2", href: "/dashboard" },
  { label: "Tours", icon: "heroicons:globe-alt", href: "/tour-management" },
  { label: "Tour Instances", icon: "heroicons:calendar-days", href: "/tour-instances" },
  {
    label: "Bookings",
    icon: "heroicons:ticket",
    href: "/dashboard/bookings",
  },
  { label: "Payments", icon: "heroicons:credit-card", href: "/dashboard/payments" },
  { label: "Customers", icon: "heroicons:user-group", href: "/dashboard/customers" },
  { label: "Insurance", icon: "heroicons:shield-check", href: "/dashboard/insurance" },
  { label: "Visa Applications", icon: "heroicons:document-check", href: "/dashboard/visa" },
  { label: "Policies", icon: "heroicons:clipboard-document-list", href: "/dashboard/policies" },
  { label: "Settings", icon: "heroicons:cog-6-tooth", href: "/dashboard/settings", active: true },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}>
      <div className="flex items-center justify-between px-5 h-16 border-b border-slate-700/50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-sm font-bold">
            P
          </div>
          <span className="text-lg font-semibold">Pathora Admin</span>
        </Link>
        <button onClick={onClose} aria-label="Close sidebar" className="lg:hidden text-slate-400 hover:text-white">
          <Icon icon="heroicons:x-mark" className="size-5" />
        </button>
      </div>
      <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              item.active ? "bg-orange-500 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}>
            <Icon icon={item.icon} className="size-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="border-t border-slate-700/50 p-3">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg">
          <div className="w-9 h-9 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-bold">
            AD
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">Administrator</p>
            <p className="text-xs text-slate-400 truncate">Administrator</p>
          </div>
        </div>
        <AdminLogoutButton />
      </div>
    </aside>
  );
}

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 flex items-center px-6 gap-4">
      <button onClick={onMenuClick} aria-label="Open menu" className="lg:hidden text-slate-500">
        <Icon icon="heroicons:bars-3" className="size-6" />
      </button>
      <div className="relative flex-1 max-w-xl">
        <Icon icon="heroicons:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <label htmlFor="settings-search" className="sr-only">Search</label>
        <input id="settings-search" type="text" placeholder="Search settings..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
      </div>
      <div className="ml-auto relative">
        <button aria-label="Notifications - 3 unread" className="relative p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
          <Icon icon="heroicons:bell" className="size-5" />
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">3</span>
        </button>
      </div>
    </header>
  );
}

const SETTINGS_TABS = [
  { id: "general", label: "General", icon: "heroicons:cog-6-tooth" },
  { id: "notifications", label: "Notifications", icon: "heroicons:bell" },
  { id: "security", label: "Security", icon: "heroicons:shield-check" },
  { id: "billing", label: "Billing", icon: "heroicons:credit-card" },
  { id: "integrations", label: "Integrations", icon: "heroicons:puzzle-piece" },
];

const TEAM_MEMBERS = [
  { id: "1", name: "Admin User", email: "admin@pathora.com", role: "Owner", status: "active" },
  { id: "2", name: "Sales Manager", email: "sales@pathora.com", role: "Admin", status: "active" },
  { id: "3", name: "Support Agent", email: "support@pathora.com", role: "Editor", status: "active" },
  { id: "4", name: "Content Writer", email: "content@pathora.com", role: "Viewer", status: "pending" },
];

export function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <button aria-label="Close sidebar" className="fixed inset-0 bg-black/30 z-40 lg:hidden cursor-default" onClick={() => setSidebarOpen(false)} />
      )}
      <div className="lg:pl-64">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main id="main-content" className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage your workspace and preferences</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-64 shrink-0">
              <Card bodyClass="!p-2">
                <nav className="space-y-1">
                  {SETTINGS_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        activeTab === tab.id ? "bg-orange-500 text-white" : "text-slate-600 hover:bg-slate-100"
                      }`}>
                      <Icon icon={tab.icon} className="size-5" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </Card>
            </div>

            <div className="flex-1 space-y-6">
              {activeTab === "general" && (
                <>
                  <Card bodyClass="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Organization</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                        <input type="text" defaultValue="Pathora" className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Business Email</label>
                        <input type="email" defaultValue="contact@pathora.com" className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
                        <select className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                          <option>Asia/Ho_Chi_Minh (GMT+7)</option>
                          <option>Asia/Tokyo (GMT+9)</option>
                          <option>Asia/Seoul (GMT+9)</option>
                          <option>UTC (GMT+0)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                        <select className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                          <option>USD ($)</option>
                          <option>VND (₫)</option>
                          <option>EUR (€)</option>
                          <option>JPY (¥)</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-200">
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white">Save Changes</Button>
                    </div>
                  </Card>

                  <Card bodyClass="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Team Members</h3>
                    <div className="space-y-3">
                      {TEAM_MEMBERS.map((member) => (
                        <div key={member.id} className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600">
                              {member.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">{member.name}</p>
                              <p className="text-xs text-slate-500">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${member.status === "active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                              {member.status === "active" ? "Active" : "Pending"}
                            </span>
                            <span className="text-xs text-slate-500">{member.role}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Button className="border border-slate-200 text-slate-700 bg-white hover:bg-slate-50">Invite Member</Button>
                    </div>
                  </Card>
                </>
              )}

              {activeTab === "notifications" && (
                <Card bodyClass="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    {[
                      { label: "Email notifications for new bookings", description: "Get notified when a customer makes a new booking", enabled: true },
                      { label: "Payment reminders", description: "Receive alerts for pending payments", enabled: true },
                      { label: "Visa application updates", description: "Get notified when visa status changes", enabled: true },
                      { label: "Tour departure reminders", description: "Alerts before tour departure dates", enabled: false },
                      { label: "Weekly reports", description: "Receive weekly summary reports", enabled: true },
                      { label: "Marketing updates", description: "News and promotional content", enabled: false },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.description}</p>
                        </div>
                        <button className={`relative w-11 h-6 rounded-full transition-colors ${item.enabled ? "bg-orange-500" : "bg-slate-200"}`}>
                          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${item.enabled ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {activeTab === "security" && (
                <Card bodyClass="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Security Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 mb-3">Change Password</h4>
                      <div className="space-y-3">
                        <input type="password" placeholder="Current password" className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                        <input type="password" placeholder="New password" className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                        <input type="password" placeholder="Confirm new password" className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                      </div>
                      <Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white">Update Password</Button>
                    </div>
                    <div className="pt-4 border-t border-slate-200">
                      <h4 className="text-sm font-medium text-slate-900 mb-3">Two-Factor Authentication</h4>
                      <p className="text-sm text-slate-500 mb-3">Add an extra layer of security to your account</p>
                      <Button className="border border-slate-200 text-slate-700 bg-white hover:bg-slate-50">Enable 2FA</Button>
                    </div>
                    <div className="pt-4 border-t border-slate-200">
                      <h4 className="text-sm font-medium text-slate-900 mb-3">Active Sessions</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Icon icon="heroicons:computer-desktop" className="size-5 text-slate-400" />
                            <span className="text-sm text-slate-700">Chrome on Windows</span>
                          </div>
                          <span className="text-xs text-green-600">Current session</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {activeTab === "billing" && (
                <Card bodyClass="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Billing & Subscription</h3>
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white mb-6">
                    <p className="text-sm text-orange-100">Current Plan</p>
                    <p className="text-2xl font-bold mt-1">Professional</p>
                    <p className="text-sm text-orange-100 mt-2">$99/month • Renews on Apr 1, 2026</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                      <span className="text-sm text-slate-600">API Calls</span>
                      <span className="text-sm font-medium text-slate-900">8,450 / 10,000</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Storage Used</span>
                      <span className="text-sm font-medium text-slate-900">2.4 GB / 10 GB</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-slate-600">Team Members</span>
                      <span className="text-sm font-medium text-slate-900">4 / 10</span>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">Upgrade Plan</Button>
                    <Button className="border border-slate-200 text-slate-700 bg-white hover:bg-slate-50">View Invoices</Button>
                  </div>
                </Card>
              )}

              {activeTab === "integrations" && (
                <Card bodyClass="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Integrations</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Payment Gateway", description: "Accept online payments", icon: "heroicons:credit-card", connected: true },
                      { name: "Email Service", description: "Send transactional emails", icon: "heroicons:envelope", connected: true },
                      { name: "SMS Notifications", description: "Send SMS alerts", icon: "heroicons:chat-bubble-left-right", connected: false },
                      { name: "Analytics", description: "Track website analytics", icon: "heroicons:chart-bar", connected: true },
                      { name: "CRM Integration", description: "Connect with CRM tools", icon: "heroicons:users", connected: false },
                    ].map((integration, i) => (
                      <div key={i} className="flex items-center justify-between py-4 px-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Icon icon={integration.icon} className="size-5 text-slate-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{integration.name}</p>
                            <p className="text-xs text-slate-500">{integration.description}</p>
                          </div>
                        </div>
                        <Button className={integration.connected ? "border border-green-500 text-green-600 bg-white hover:bg-green-50" : "bg-orange-500 hover:bg-orange-600 text-white"}>
                          {integration.connected ? "Connected" : "Connect"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SettingsPage;
