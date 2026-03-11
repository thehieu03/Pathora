import Link from "next/link";

import Icon from "../../ui/Icon";

interface DashboardSectionPlaceholderProps {
  title: string;
  description: string;
}

export default function DashboardSectionPlaceholder({
  title,
  description,
}: DashboardSectionPlaceholderProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-16">
        <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
            <Icon icon="heroicons:wrench-screwdriver" className="size-6" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">{description}</p>
          <p className="mt-4 text-sm font-medium text-orange-600">
            This section is under construction.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600">
              <Icon icon="heroicons:arrow-left" className="size-4" />
              Back to dashboard
            </Link>
            <Link
              href="/tour-management"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
              <Icon icon="heroicons:globe-alt" className="size-4" />
              Manage tours
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
