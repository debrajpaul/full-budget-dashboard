import { ReactNode } from 'react';
import { currency } from '@/lib/format';

const palettes = {
  income: { bg: 'bg-accentBlue/10', text: 'text-accentBlue' },
  expenses: { bg: 'bg-accentRed/10', text: 'text-accentRed' },
  savings: { bg: 'bg-accentGreen/10', text: 'text-accentGreen' },
  budget: { bg: 'bg-accentOrange/10', text: 'text-accentOrange' },
  default: { bg: 'bg-gray-100', text: 'text-primary' },
};

type PaletteKey = keyof typeof palettes;

type KPIProps = {
  label: string;
  value: number;
  color?: PaletteKey;
  icon?: ReactNode;
  formatter?: (value: number) => string;
  fmt?: (value: number) => string;
};

export default function KPI({ label, value, color = 'default', icon, formatter, fmt }: KPIProps) {
  const palette = palettes[color] ?? palettes.default;
  const format = formatter ?? fmt ?? currency;
  return (
    <div className={`p-4 rounded-xl shadow-sm ${palette.bg}`}>
      <div className="flex items-center mb-2">
        {icon && (
          <div className={`${palette.text} w-9 h-9 rounded-lg bg-white/70 flex items-center justify-center mr-3`}>
            {icon}
          </div>
        )}
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <div className={`text-2xl font-semibold ${palette.text}`}>{format(value)}</div>
    </div>
  );
}
