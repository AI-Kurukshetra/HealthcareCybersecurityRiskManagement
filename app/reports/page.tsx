import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { getDashboardData, getReportData } from "@/lib/data";
import { hasPermission } from "@/lib/permissions";

export default async function ReportsPage() {
  const dashboard = await getDashboardData();
  const report = await getReportData();
  const canGenerateReports = hasPermission(
    dashboard.currentUser.profile.role,
    "generate_reports",
  );
  const canViewAuditLogs = hasPermission(dashboard.currentUser.profile.role, "view_audit_logs");
  const previewReport = canViewAuditLogs ? report : { ...report, audit_logs: [] };
  const criticalOpen = report.vulnerabilities.filter(
    (item) => item.severity === "critical" && item.status !== "remediated",
  ).length;
  const activeIncidents = report.incidents.filter((item) => item.status !== "closed").length;

  return (
    <AppShell
      title="Security Reports"
      description="Generate executive and operational snapshots directly from the live data model, with JSON export for downstream workflows."
      organizationName={report.organization}
      userEmail={dashboard.currentUser.email}
      notificationCount={dashboard.openAlerts.length}
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="glass-panel rounded-[28px] p-6">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-teal-300">Executive</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Leadership overview</h3>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Current security score posture, critical exposure count, and active incident load.
          </p>
        </article>
        <article className="glass-panel rounded-[28px] p-6">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-orange-300">Operations</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Response workload</h3>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            {criticalOpen} critical vulnerabilities and {activeIncidents} active incidents remain in focus.
          </p>
        </article>
        <article className="glass-panel rounded-[28px] p-6">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">Export</p>
          <h3 className="mt-2 text-xl font-semibold text-white">JSON reports</h3>
          {canGenerateReports ? (
            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/api/reports?type=executive&format=json"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:border-teal-300/40 hover:bg-teal-300/10"
              >
                Download executive report
              </Link>
              <Link
                href="/api/reports?type=compliance&format=json"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:border-teal-300/40 hover:bg-teal-300/10"
              >
                Download compliance report
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Viewer and staff accounts can review the report preview, but export generation is
              limited to admins and security analysts.
            </p>
          )}
        </article>
      </section>

      <article className="glass-panel rounded-[28px] p-6">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">
          Report preview
        </p>
        <pre className="mt-4 overflow-x-auto rounded-3xl border border-white/10 bg-slate-950/50 p-4 text-[11px] leading-6 text-slate-300 sm:p-5 sm:text-xs">
          {JSON.stringify(previewReport, null, 2)}
        </pre>
      </article>
    </AppShell>
  );
}
