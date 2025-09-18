import { currency } from '@/lib/format';
import { categoryEmoji, categoryColor } from './category';

export default function EnvelopeCard({
  name,
  amount,
  maxAmount,
}: {
  name: string;
  amount: number;
  maxAmount: number;
}) {
  const pct = Math.max(0, Math.min(100, maxAmount ? (amount / maxAmount) * 100 : 0));
  const bg = categoryColor(name);
  return (
    <div className="rounded-2xl border overflow-hidden">
      <div className="p-4" style={{ backgroundColor: bg }}>
        <div className="flex items-center gap-2">
          <div className="text-xl" aria-hidden>
            {categoryEmoji(name)}
          </div>
          <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{name}</div>
          <span className="ml-auto text-xs text-zinc-600 bg-white/70 dark:bg-zinc-900/30 px-2 py-0.5 rounded-full">
            This period
          </span>
        </div>
        <div className="mt-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{currency(amount)}</div>
      </div>
      <div className="px-4 py-3">
        <div className="w-full h-2 bg-zinc-200/60 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-2 bg-zinc-900 dark:bg-zinc-200"
            style={{ width: pct + '%' }}
          />
        </div>
        <div className="mt-2 text-xs text-zinc-500">Share of spending</div>
      </div>
    </div>
  );
}

