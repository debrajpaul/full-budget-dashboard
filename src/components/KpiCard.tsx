import { currency } from '@/lib/format';

const palettes = {
  income: { background: 'bg-accentBlue/10', text: 'text-accentBlue' },
  expense: { background: 'bg-accentRed/10', text: 'text-accentRed' },
  savings: { background: 'bg-accentGreen/10', text: 'text-accentGreen' },
  budget: { background: 'bg-accentOrange/10', text: 'text-accentOrange' },
  default: { background: 'bg-gray-100', text: 'text-primary' },
};

type PaletteKey = keyof typeof palettes;

type KpiCardProps = {
  label: string;
  value: number;
  color?: PaletteKey;
};

export function KpiCard({ label, value, color = 'default' }: KpiCardProps) {
  const palette = palettes[color] ?? palettes.default;

  return (
    <div className={`rounded-xl p-5 shadow-sm sm:p-6 ${palette.background}`}>
      <div className={`text-xs font-medium uppercase tracking-wide ${palette.text}`}>{label}</div>
      <div className={`mt-2 text-2xl font-semibold ${palette.text}`}>{currency(value)}</div>
    </div>
  );
}
