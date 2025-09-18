import { currency } from '@/lib/format';

export default function LeftThisPeriod({
  series,
}: {
  series: { date: string; budget: number; actual: number }[];
}) {
  const totals = (series || []).reduce(
    (acc, p) => {
      acc.budget += p?.budget || 0;
      acc.actual += p?.actual || 0;
      return acc;
    },
    { budget: 0, actual: 0 }
  );
  const left = Math.max(0, totals.budget - totals.actual);
  const pct = totals.budget > 0 ? Math.max(0, Math.min(100, (left / totals.budget) * 100)) : 0;
  return (
    <div className="rounded-2xl border bg-white dark:bg-zinc-900 p-4">
      <div className="flex items-center gap-2">
        <div className="text-xl">🧾</div>
        <div className="text-sm text-zinc-500">Left This Period</div>
        <div className="ml-auto text-sm text-zinc-500">Budget: {currency(totals.budget)}</div>
      </div>
      <div className="mt-2 text-3xl font-semibold">{currency(left)}</div>
      <div className="mt-3 w-full h-2 bg-zinc-200/60 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-2 bg-emerald-500" style={{ width: pct + '%' }} />
      </div>
    </div>
  );
}

