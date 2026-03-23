export const StatCard = ({ title, value, hint }) => (
  <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur">
    <p className="text-sm text-slate-500">{title}</p>
    <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
    {hint ? <p className="mt-2 text-sm text-emerald-700">{hint}</p> : null}
  </div>
);
