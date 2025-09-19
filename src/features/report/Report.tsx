import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { TRANSACTIONS } from '@/graphql/queries';
import { useTenant } from '@/state/tenant';
import ReportDonut from '@/components/ReportDonut';

const formatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const now = new Date();

export default function Report() {
  const { tenantId } = useTenant();
  const { data, loading, error } = useQuery(TRANSACTIONS, {
    skip: !tenantId,
    variables: { year: now.getFullYear(), month: now.getMonth() + 1 },
    notifyOnNetworkStatusChange: true,
  });

  const items = data?.transactions?.items ?? [];

  const breakdown = useMemo(() => {
    const totals = new Map<string, number>();

    for (const txn of items) {
      if (!txn?.category) continue;
      const amount = typeof txn.amount === 'number' ? txn.amount : 0;
      if (amount >= 0) continue;
      const asPositive = Math.abs(amount);
      totals.set(txn.category, (totals.get(txn.category) ?? 0) + asPositive);
    }

    return Array.from(totals.entries()).map(([name, amount]) => ({ name, amount }));
  }, [items]);

  if (!tenantId) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
        Select a workspace to view reports.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="h-6 w-36 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-6 h-48 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-400/60 dark:bg-red-950/50 dark:text-red-200">
        Unable to load report data right now. Please try again later.
      </div>
    );
  }

  const totalSpent = breakdown.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Spending by category</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Breakdown of your expenses for {now.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}.
            </p>
          </div>
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Total spent: {formatter.format(totalSpent)}
          </span>
        </header>
        <div className="mt-6 flex flex-col items-center justify-center">
          <ReportDonut items={breakdown} />
        </div>
      </section>
    </div>
  );
}
