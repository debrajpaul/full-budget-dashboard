import { useQuery } from '@apollo/client';
import KPI from '@/components/KPI';
import { ArrowDownIcon, ArrowUpIcon, CalendarIcon, PiggyBankIcon } from '@/components/Icon';
import TrendChart from '@/components/TrendChart';
import CreditCard from '@/components/CreditCard';
import DonutBreakdown from '@/components/DonutBreakdown';
import RecentTransactions from '@/components/RecentTransactions';
import { OVERVIEW } from '@/graphql/queries';
import { useTenant } from '@/state/tenant';

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
  const availableBalance = (review.totalIncome ?? 0) - (review.totalExpenses ?? 0);
  const budgetValue = series.reduce((total: number, entry: { budget?: number | null } | null) => {
    return total + (entry?.budget ?? 0);
  }, 0);
  const activeTenant = tenants.find((tenant) => tenant.id === tenantId);

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
          <CreditCard
            balance={availableBalance}
            cardNumber="**** **** **** 1234"
            holder={activeTenant?.name ?? "Account Holder"}
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
