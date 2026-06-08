'use client';

export default function CampaignProgress({
  percent,
  label,
}: {
  percent: number;
  label?: string;
}) {
  const value = Math.max(0, Math.min(100, percent));
  const complete = value >= 100;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
        <span>{label ?? (complete ? 'Goal reached' : 'Funding progress')}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            complete
              ? 'bg-[linear-gradient(135deg,#16a34a,#22c55e)]'
              : 'bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))]'
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
