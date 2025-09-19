import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';

import { TRANSACTIONS } from '@/graphql/queries';
import TransactionsTable, { type TransactionsTableItem } from './TransactionsTable';

type TransactionItem = {
  id: string;
  date: string;
  description?: string | null;
  amount: number;
  currency: string;
  category?: string | null;
  taggedBy?: string | null;
};

type TransactionsResponse = {
  transactions: {
    items: TransactionItem[];
  };
};

type TransactionsVariables = {
  filters: {
    month: number;
    year: number;
  };
};

type RecentTransactionsProps = {
  month?: number;
  year?: number;
};

export default function RecentTransactions({ month, year }: RecentTransactionsProps) {
  const today = dayjs();
  const fallbackMonth = today.month() + 1;
  const fallbackYear = today.year();

  const selectedMonth =
    typeof month === 'number' && Number.isFinite(month)
      ? Math.min(Math.max(Math.floor(month), 1), 12)
      : fallbackMonth;

  const selectedYear =
    typeof year === 'number' && Number.isFinite(year) ? Math.floor(year) : fallbackYear;

  const periodLabel = useMemo(
    () => dayjs().year(selectedYear).month(selectedMonth - 1).date(1).format('MMM YYYY'),
    [selectedMonth, selectedYear]
  );

  const variables = useMemo<TransactionsVariables>(
    () => ({
      filters: {
        month: selectedMonth,
        year: selectedYear,
      },
    }),
    [selectedMonth, selectedYear]
  );

  const { data, loading, error } = useQuery<TransactionsResponse, TransactionsVariables>(TRANSACTIONS, {
    variables,
  });

  const recentTransactions = useMemo(() => {
    const items = data?.transactions?.items ?? [];
    return [...items]
      .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
      .slice(0, 5);
  }, [data]);

  const tableTransactions = useMemo<TransactionsTableItem[]>(
    () =>
      recentTransactions.map((transaction) => ({
        id: transaction.id,
        date: transaction.date,
        description: transaction.description ?? 'Untitled transaction',
        amount: transaction.amount,
        category: transaction.category ?? 'Uncategorized',
      })),
    [recentTransactions]
  );

  const hasError = !loading && Boolean(error);

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Recent Transactions</h2>
          <p className="text-xs text-zinc-500">Period: {periodLabel}</p>
        </div>
        {loading && <span className="text-xs text-zinc-500">Loading…</span>}
      </header>

      {hasError ? (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Failed to load transactions. Please try again.
        </div>
      ) : (
        <TransactionsTable loading={loading} transactions={tableTransactions} />
      )}
    </section>
  );
}
