const palette = {
  Pending: "bg-amber-400/20 text-amber-200",
  "Out for Trial": "bg-cyan-400/20 text-cyan-200",
  Delivered: "bg-sky-400/20 text-sky-200",
  Accepted: "bg-emerald-400/20 text-emerald-200",
  Returned: "bg-rose-400/20 text-rose-200",
  Assigned: "bg-indigo-400/20 text-indigo-200",
  Picked: "bg-fuchsia-400/20 text-fuchsia-200",
  "Out for Delivery": "bg-orange-400/20 text-orange-200",
  "At Customer Location": "bg-violet-400/20 text-violet-200",
  "Pending Assignment": "bg-slate-400/20 text-slate-200"
};

export default function StatusBadge({ value }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${palette[value] || "bg-white/10 text-white"}`}>
      {value}
    </span>
  );
}
