type ReportItem = {
  name: string;
  amount: number;
};

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f43f5e'];

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

export default function ReportDonut({ items }: { items: ReportItem[] }) {
  const filtered = (items || []).filter((item) => (item?.amount ?? 0) > 0);
  const total = filtered.reduce((sum, item) => sum + item.amount, 0);

  if (!filtered.length || total <= 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-200 bg-white p-4 text-sm text-zinc-500">
        <span>No data available</span>
      </div>
    );
  }

  let cursor = 0;
  const segments = filtered.map((item, index) => {
    const ratio = item.amount / total;
    const start = cursor;
    cursor += ratio;
    const color = COLORS[index % COLORS.length];
    return {
      ...item,
      ratio,
      color,
      gradientStop: `${color} ${start * 100}% ${index === filtered.length - 1 ? 100 : cursor * 100}%`,
    };
  });

  const gradient = `conic-gradient(${segments.map((segment) => segment.gradientStop).join(', ')})`;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex justify-center">
        <div className="relative flex h-56 w-56 items-center justify-center">
          <div className="h-full w-full rounded-full" style={{ background: gradient }} />
          <div className="absolute flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white shadow-sm">
            <span className="text-xs uppercase tracking-wide text-zinc-400">Total</span>
            <span className="text-lg font-semibold text-zinc-800">{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <ul className="grid w-full grid-cols-1 gap-4 text-sm text-zinc-600 sm:grid-cols-2">
        {segments.map((segment) => (
          <li key={segment.name} className="flex items-center gap-4 rounded-md border border-zinc-100 bg-zinc-50/80 p-4">
            <span
              className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: segment.color }}
              aria-hidden
            />
            <span className="font-medium text-zinc-800">{segment.name}</span>
            <span className="ml-auto text-xs font-semibold text-zinc-700">{formatPercent(segment.ratio)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
