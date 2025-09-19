import type { ReactNode } from 'react';

import { currency } from '@/lib/format';

type BalanceCardProps = {
  balance: number;
  holderName: string;
  expiry: string;
  cardType?: string;
};

const VisaLogo = () => (
  <svg
    viewBox="0 0 64 40"
    role="img"
    aria-label="Visa card"
    className="h-10 w-16 drop-shadow-sm"
  >
    <rect width="64" height="40" rx="10" fill="rgba(255,255,255,0.2)" />
    <text
      x="32"
      y="25"
      fontSize="18"
      fontWeight="700"
      textAnchor="middle"
      fill="#ffffff"
      fontFamily="'Inter', 'Segoe UI', sans-serif"
    >
      VISA
    </text>
    <rect x="8" y="6" width="48" height="6" fill="#1a1f71" rx="3" opacity="0.8" />
    <rect x="12" y="32" width="40" height="4" fill="#ffb600" rx="2" opacity="0.9" />
  </svg>
);

const MastercardLogo = () => (
  <svg
    viewBox="0 0 64 40"
    role="img"
    aria-label="Mastercard"
    className="h-10 w-16 drop-shadow-sm"
  >
    <rect width="64" height="40" rx="10" fill="rgba(255,255,255,0.2)" />
    <circle cx="26" cy="20" r="10" fill="#eb001b" opacity="0.9" />
    <circle cx="38" cy="20" r="10" fill="#f79e1b" opacity="0.9" />
    <path d="M31 10h2v20h-2z" fill="#ff5f00" />
  </svg>
);

const AmexLogo = () => (
  <svg
    viewBox="0 0 64 40"
    role="img"
    aria-label="American Express"
    className="h-10 w-16 drop-shadow-sm"
  >
    <rect width="64" height="40" rx="10" fill="#1f6ae5" opacity="0.75" />
    <rect x="4" y="6" width="56" height="28" rx="8" fill="rgba(255,255,255,0.15)" />
    <text
      x="32"
      y="24"
      fontSize="12"
      fontWeight="700"
      textAnchor="middle"
      fill="#fff"
      fontFamily="'Inter', 'Segoe UI', sans-serif"
    >
      AMEX
    </text>
  </svg>
);

const RuPayLogo = () => (
  <svg
    viewBox="0 0 64 40"
    role="img"
    aria-label="RuPay"
    className="h-10 w-16 drop-shadow-sm"
  >
    <rect width="64" height="40" rx="10" fill="rgba(255,255,255,0.2)" />
    <path d="M10 20h18c4 0 6-2 6-6s-2-6-6-6H10z" fill="#003399" opacity="0.9" />
    <path d="M10 20h18c4 0 6 2 6 6s-2 6-6 6H10z" fill="#f58220" opacity="0.9" />
    <polygon points="42,14 54,20 42,26" fill="#00a14b" opacity="0.95" />
  </svg>
);

const DefaultCardGlyph = () => (
  <svg
    viewBox="0 0 64 40"
    role="img"
    aria-label="Payment card"
    className="h-10 w-16 drop-shadow-sm"
  >
    <rect width="64" height="40" rx="10" fill="rgba(255,255,255,0.18)" />
    <rect x="8" y="12" width="48" height="6" rx="3" fill="#fff" opacity="0.7" />
    <rect x="8" y="22" width="28" height="4" rx="2" fill="#fff" opacity="0.5" />
    <rect x="40" y="22" width="16" height="10" rx="4" fill="#fff" opacity="0.35" />
  </svg>
);

const cardLogos: Record<string, ReactNode> = {
  visa: <VisaLogo />,
  mastercard: <MastercardLogo />,
  maestro: <MastercardLogo />, // share art
  amex: <AmexLogo />,
  'american express': <AmexLogo />,
  rupay: <RuPayLogo />,
};

const getCardLogo = (cardType?: string) => {
  if (!cardType) return <DefaultCardGlyph />;
  const key = cardType.trim().toLowerCase();
  return cardLogos[key] ?? <DefaultCardGlyph />;
};

export default function BalanceCard({
  balance,
  holderName,
  expiry,
  cardType,
}: BalanceCardProps) {
  const brandLabel = cardType ? cardType.toUpperCase() : undefined;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 p-4 text-white shadow-xl sm:p-6">
      <div className="flex items-start justify-between gap-4 text-left">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/70">Total Balance</p>
          <p className="mt-4 text-3xl font-semibold">{currency(balance)}</p>
        </div>

        <div className="flex flex-col items-end gap-3 text-right">
          <div className="flex items-center justify-center rounded-2xl bg-white/10 p-2 backdrop-blur-sm">
            {getCardLogo(cardType)}
          </div>
          {brandLabel && (
            <span className="text-[0.65rem] uppercase tracking-[0.4em] text-white/70">{brandLabel}</span>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/60">Card Holder</p>
          <p className="mt-1 font-medium">{holderName}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-white/60">Expires</p>
          <p className="mt-1 font-medium">{expiry}</p>
        </div>
      </div>
    </div>
  );
}
