import { useQuery } from '@apollo/client';
import KPI from '@/components/KPI';
import OverviewCard from '@/components/OverviewCard';
import { ArrowDownIcon, ArrowUpIcon, CalendarIcon, PiggyBankIcon } from '@/components/Icon';
import TrendChart from '@/components/TrendChart';
import BalanceCard from '@/components/BalanceCard';
import DonutBreakdown from '@/components/DonutBreakdown';
import RecentTransactions from '@/components/RecentTransactions';
import { OVERVIEW } from '@/graphql/queries';
import { useTenant } from '@/state/tenant';

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const formatINR = (amount: number) => inrFormatter.format(amount ?? 0);
const percentFormatter = new Intl.NumberFormat('en-IN', {
  style: 'percent',
  maximumFractionDigits: 1,
});

const formatPercent = (ratio: number) => percentFormatter.format(Math.abs(ratio));

const now = new Date();

export default function Overview() {
  const { tenantId, tenants } = useTenant();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { data, loading } = useQuery(OVERVIEW, {
    variables: { month, year },
    skip: !tenantId,
  });

  if (!tenantId) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
        Select a workspace to see your overview.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 rounded-2xl border border-transparent bg-zinc-200/70 shadow-sm animate-pulse dark:bg-zinc-800"
            />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="h-80 rounded-2xl border bg-white shadow-sm animate-pulse xl:col-span-2 dark:border-zinc-800 dark:bg-zinc-900" />
          <div className="flex flex-col gap-6">
            <div className="h-44 rounded-2xl bg-gradient-to-br from-accentBlue/60 to-accentGreen/60 shadow-md animate-pulse" />
            <div className="h-64 rounded-2xl border bg-white shadow-sm animate-pulse dark:border-zinc-800 dark:bg-zinc-900" />
          </div>
        </div>

        <div className="h-64 rounded-2xl border bg-white shadow-sm animate-pulse dark:border-zinc-800 dark:bg-zinc-900" />
      </div>
    );
  }

  const review = data?.monthlyReview ?? {};
  const series = Array.isArray(review.series) ? review.series : [];
  const breakdown = Array.isArray(review.categoryBreakdown) ? review.categoryBreakdown : [];
  const totalIncome = review.totalIncome ?? 0;
  const availableBalance = totalIncome - (review.totalExpenses ?? 0);
  const budgetValue = series.reduce((total: number, entry: { budget?: number | null } | null) => {
    return total + (entry?.budget ?? 0);
  }, 0);
  const actualSpent = series.reduce((total: number, entry: { actual?: number | null } | null) => {
    return total + (entry?.actual ?? 0);
  }, 0);
  const budgetRemaining = Math.max(0, budgetValue - actualSpent);
  const activeTenant = tenants.find((tenant) => tenant.id === tenantId);

  const cardBrands = ['Visa', 'Mastercard', 'Amex', 'RuPay'] as const;
  const cardType = tenantId ? cardBrands[tenantId.charCodeAt(0) % cardBrands.length] : cardBrands[0];
  const expiryDate = new Date(year + 3, month - 1);
  const cardExpiry = `${String(expiryDate.getMonth() + 1).padStart(2, '0')}/${String(expiryDate.getFullYear()).slice(-2)}`;

  const savings = review.savings ?? 0;
  const savingsRate = totalIncome > 0 ? savings / totalIncome : undefined;
  const formattedSavingsDelta = savingsRate !== undefined
    ? `${formatINR(Math.abs(savings))} (${formatPercent(savingsRate)})`
    : formatINR(Math.abs(savings));

  const spendingRate = budgetValue > 0 ? actualSpent / budgetValue : undefined;
  const formattedSpendingDelta = spendingRate !== undefined
    ? `${formatINR(Math.abs(actualSpent))} (${formatPercent(spendingRate)})`
    : formatINR(Math.abs(actualSpent));

  const periodLabel = new Date(year, month - 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const kpis = [
    { label: 'Income', value: review.totalIncome ?? 0, color: 'income' as const, icon: <ArrowUpIcon /> },
    { label: 'Expenses', value: review.totalExpenses ?? 0, color: 'expenses' as const, icon: <ArrowDownIcon /> },
    { label: 'Savings', value: review.savings ?? 0, color: 'savings' as const, icon: <PiggyBankIcon /> },
    { label: 'Budget', value: budgetValue, color: 'budget' as const, icon: <CalendarIcon /> },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <OverviewCard
          title="Available Balance"
          value={availableBalance}
          delta={formattedSavingsDelta}
          deltaLabel="Saved this month"
          isPositive={savings >= 0}
        />
        <OverviewCard
          title="Budget Remaining"
          value={budgetRemaining}
          delta={formattedSpendingDelta}
          deltaLabel="Spent so far"
          isPositive={actualSpent <= budgetValue}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, color, icon }) => (
          <KPI key={label} label={label} value={value} color={color} icon={icon} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border bg-white shadow-sm xl:col-span-2 dark:border-zinc-800 dark:bg-zinc-900">
          <header className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
            <div>
              <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Budget vs actual</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Track how you are pacing for the current period.</p>
            </div>
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{periodLabel}</span>
          </header>
          <div className="px-6 pb-6">
            <TrendChart data={series} />
          </div>
        </section>

        <div className="flex flex-col gap-6">
          <BalanceCard
            balance={availableBalance}
            holderName={activeTenant?.name ?? 'Primary Account'}
            expiry={cardExpiry}
            cardType={cardType}
          />

          <section className="rounded-2xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <header>
              <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Spending breakdown</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">See where your spending is concentrated.</p>
            </header>
            <div className="mt-4 h-64">
              <DonutBreakdown items={breakdown} />
            </div>
          </section>
        </div>
      </div>

      <RecentTransactions month={month} year={year} />
    </div>
  );
}
