interface AccessNoticeProps {
  title: string;
  description: string;
}

export function AccessNotice({ title, description }: AccessNoticeProps) {
  return (
    <article className="glass-panel rounded-[28px] p-6 sm:p-7">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">
        Read-only access
      </p>
      <h3 className="mt-2 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
    </article>
  );
}
