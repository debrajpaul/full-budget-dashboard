const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const formatDelta = (value: string | number) =>
  typeof value === 'number'
    ? Math.abs(value).toLocaleString('en-IN', { maximumFractionDigits: 1 })
    : value;

type OverviewCardProps = {
  title: string;
  value: number;
  delta?: string | number;
  deltaLabel?: string;
  isPositive?: boolean;
};

export default function OverviewCard({ title, value, delta, deltaLabel, isPositive }: OverviewCardProps) {
  const positive = typeof isPositive === 'boolean' ? isPositive : typeof delta === 'number' ? delta >= 0 : true;
  const deltaClasses = positive ? 'text-green-600' : 'text-red-600';

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm">
      <div className="text-sm font-medium text-slate-500">{title}</div>
      <div className="text-3xl font-semibold text-slate-900">{inrFormatter.format(value ?? 0)}</div>
      {(delta !== undefined || deltaLabel) && (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className={`inline-flex items-center gap-1 font-medium ${deltaClasses}`}>
            <span className="text-sm leading-none">{positive ? '▲' : '▼'}</span>
            {delta !== undefined && formatDelta(delta)}
          </span>
          {deltaLabel && <span className="text-slate-500">{deltaLabel}</span>}
        </div>
      )}
    </div>
  );
}
