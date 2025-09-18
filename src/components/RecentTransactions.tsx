import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';

import { TRANSACTIONS } from '@/graphql/queries';
import { Card } from '@/components/Card';

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
    year: number;
    month: number;
    bankName?: string | null;
    category?: string | null;
  };
  cursor?: string | null;
};

type RecentTransactionsProps = {
  month?: number;
  year?: number;
};

function formatAmount(value: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
  } catch {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}

function getStatusLabel(item: TransactionItem) {
  if (item.taggedBy) return 'Categorized';
  if (item.category) return 'Suggested';
  return 'Pending';
}

const skeletonRows = Array.from({ length: 5 }, (_, index) => (
  <tr key={`skeleton-${index}`} className="border-b last:border-b-0">
    <td className="py-3">
      <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="py-3 text-right">
      <div className="ml-auto h-4 w-20 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="py-3">
      <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="py-3 text-right">
      <div className="ml-auto h-4 w-16 animate-pulse rounded bg-gray-200" />
    </td>
  </tr>
));

export default function RecentTransactions({ month, year }: RecentTransactionsProps) {
  const fallbackDate = dayjs();
  const fallbackMonth = fallbackDate.month() + 1;
  const fallbackYear = fallbackDate.year();

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

  const variables = useMemo<TransactionsVariables>(() => ({
    filters: {
      month: selectedMonth,
      year: selectedYear,
    },
  }), [selectedMonth, selectedYear]);

  const { data, loading, error } = useQuery<TransactionsResponse, TransactionsVariables>(TRANSACTIONS, {
    variables,
  });

  const recentTransactions = useMemo(() => {
    const items = data?.transactions?.items ?? [];
    return [...items]
      .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
      .slice(0, 5);
  }, [data]);

  return (
    <Card>
      <div className="flex items-center justify-between gap-4 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Recent Transactions</h2>
          <p className="text-xs text-zinc-500">Period: {periodLabel}</p>
        </div>
        {loading && <span className="text-xs text-zinc-500">Loading…</span>}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-zinc-700">
          <thead className="border-b text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th scope="col" className="py-2 pr-4 font-medium">Description</th>
              <th scope="col" className="py-2 pr-4 text-right font-medium">Amount</th>
              <th scope="col" className="py-2 pr-4 font-medium">Date</th>
              <th scope="col" className="py-2 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading && skeletonRows}
            {!loading && error && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-sm text-rose-600">
                  Failed to load transactions. Please try again.
                </td>
              </tr>
            )}
            {!loading && !error && recentTransactions.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-sm text-zinc-500">
                  No transactions found for {periodLabel}.
                </td>
              </tr>
            )}
            {!loading && !error &&
              recentTransactions.map((transaction) => {
                const amountClass = transaction.amount >= 0 ? 'text-emerald-600' : 'text-rose-600';
                const formattedAmount = formatAmount(transaction.amount, transaction.currency);
                const formattedDate = dayjs(transaction.date).format('MMM D, YYYY');
                const statusLabel = getStatusLabel(transaction);

                return (
                  <tr key={transaction.id}>
                    <td className="py-3 pr-4 font-medium text-zinc-900">
                      {transaction.description ?? 'Untitled transaction'}
                    </td>
                    <td className={`py-3 pr-4 text-right font-semibold ${amountClass}`}>
                      {formattedAmount}
                    </td>
                    <td className="py-3 pr-4 text-zinc-500">
                      {formattedDate}
                    </td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
