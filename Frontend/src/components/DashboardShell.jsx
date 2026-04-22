export default function DashboardShell({ title, subtitle, actions, children }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glow md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Role Workspace</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{subtitle}</p>
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
      <div className="grid gap-6">{children}</div>
    </section>
  );
}
