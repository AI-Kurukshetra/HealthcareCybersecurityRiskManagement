import { updateBackupJobAction } from "@/app/actions";
import { AccessNotice } from "@/components/AccessNotice";
import { AppShell } from "@/components/AppShell";
import { BackupJobForm } from "@/components/forms/BackupJobForm";
import { getBackupData } from "@/lib/data";
import { hasPermission } from "@/lib/permissions";

export default async function BackupsPage() {
  const data = await getBackupData();
  const canCreateBackup = hasPermission(data.currentUser.profile.role, "create_backup_job");
  const canEditBackup = hasPermission(data.currentUser.profile.role, "edit_backup_job");

  return (
    <AppShell
      title="Backup & Recovery Monitoring"
      description="Track backup executions, quickly spot failed or warning states, and keep recovery monitoring visible within the security platform."
      organizationName={data.currentUser.organization?.name}
      userEmail={data.currentUser.email}
      notificationCount={data.alertCount}
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="panel-subtle rounded-[24px] p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Recorded jobs
          </p>
          <p className="mt-3 text-3xl font-semibold text-white">{data.backups.length}</p>
        </article>
        <article className="panel-subtle rounded-[24px] p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Failed jobs
          </p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {data.backups.filter((backup) => backup.status === "failed").length}
          </p>
        </article>
        <article className="panel-subtle rounded-[24px] p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Latest size
          </p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {data.backups[0] ? `${data.backups[0].backup_size} GB` : "0 GB"}
          </p>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        {canCreateBackup ? (
          <article className="glass-panel rounded-[28px] p-6 sm:p-7">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-orange-300">
              Backup status
            </p>
            <h3 className="mt-2 text-4xl font-semibold text-white">{data.summary.label}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-400">{data.summary.detail}</p>
            <div className="mt-6">
              <BackupJobForm />
            </div>
          </article>
        ) : (
          <AccessNotice
            title="Backup job creation is limited to admins."
            description="Security analysts can update the status of existing jobs, and viewer or staff accounts can monitor backup health without changing records."
          />
        )}

        <article className="glass-panel rounded-[28px] p-6 sm:p-7">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">
            Backup jobs
          </p>
          <div className="mt-7 space-y-4">
            {data.backups.map((backup) => (
              <article key={backup.id} className="rounded-3xl border border-white/8 bg-white/[0.03] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {backup.status[0].toUpperCase() + backup.status.slice(1)}
                    </h4>
                    <p className="mt-2 text-sm text-slate-400">
                      {new Date(backup.last_backup_time).toLocaleString()}
                    </p>
                    <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                      Size {backup.backup_size} GB
                    </p>
                  </div>
                  {canEditBackup ? (
                    <form
                      action={async (formData) => {
                        "use server";
                        await updateBackupJobAction(backup.id, {
                          status: formData.get("status"),
                        });
                      }}
                    >
                      <select
                        name="status"
                        defaultValue={backup.status}
                        className="surface-input rounded-xl px-3 py-2 text-sm text-white"
                      >
                        <option value="success">Success</option>
                        <option value="warning">Warning</option>
                        <option value="failed">Failed</option>
                        <option value="running">Running</option>
                      </select>
                      <button
                        type="submit"
                        className="ml-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-200 transition hover:bg-white/10"
                      >
                        Save
                      </button>
                    </form>
                  ) : (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.16em] text-slate-300">
                      View only
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>
    </AppShell>
  );
}
