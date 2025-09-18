import { currency } from '@/lib/format';

type KpiPaletteKey = 'default' | 'income' | 'expense' | 'savings';

const palette: Record<KpiPaletteKey, { background: string; text: string }> = {
  default: { background: 'bg-secondary', text: 'text-primary' },
  income: { background: 'bg-income/10', text: 'text-income' },
  expense: { background: 'bg-expense/10', text: 'text-expense' },
  savings: { background: 'bg-savings/10', text: 'text-savings' },
};

type KpiCardProps = {
  label: string;
  value: number;
  color?: Exclude<KpiPaletteKey, 'default'>;
};

export function KpiCard({ label, value, color }: KpiCardProps) {
  const { background, text } = palette[color ?? 'default'];

  return (
    <div className={`rounded-xl p-5 shadow-sm sm:p-6 ${background}`}>
      <div className={`text-xs font-medium uppercase tracking-wide ${text}`}>{label}</div>
      <div className={`mt-2 text-2xl font-semibold ${text}`}>{currency(value)}</div>
    </div>
  );
}
