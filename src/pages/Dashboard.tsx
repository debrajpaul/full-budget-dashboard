import { useMemo } from 'react';
import { useQuery } from '@apollo/client';

import DashboardLayout from '@/components/DashboardLayout';
import OverviewCard from '@/components/OverviewCard';
import BalanceCard from '@/components/BalanceCard';
import ReportDonut from '@/components/ReportDonut';
import TransactionsTable from '@/components/TransactionsTable';
import {
  AGGREGATE_SUMMARY,
  MONTHLY_REVIEW_SUMMARY,
  DASHBOARD_TRANSACTIONS,
} from '@/graphql/queries';

type AggregateSummaryData = {
  aggregateSummary: {
    totalIncome: number;
    totalExpense: number;
    netSavings: number;
  };
};

type MonthlyReviewData = {
  monthlyReview: {
    totalIncome: number;
    totalExpenses: number;
    savings: number;
    categoryBreakdown: { name: string; amount: number }[];
  };
};

type TransactionsData = {
  transactions: {
    items: {
      id: string;
      date: string;
      description?: string | null;
      amount: number;
      currency: string;
      category?: string | null;
      taggedBy?: string | null;
    }[];
    cursor?: string | null;
  };
};

type TransactionsVariables = {
  filters: {
    year: number;
    month: number;
  };
  cursor?: string | null;
};

const formatExpiry = (year: number, month: number) => {
  const expiryDate = new Date(year + 3, month - 1);
  const expiryMonth = String(expiryDate.getMonth() + 1).padStart(2, '0');
  const expiryYear = String(expiryDate.getFullYear()).slice(-2);
  return `${expiryMonth}/${expiryYear}`;
};

export default function Dashboard() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const {
    data: aggregateData,
    loading: summaryLoading,
    error: summaryError,
  } = useQuery<AggregateSummaryData>(AGGREGATE_SUMMARY, {
    variables: { year: currentYear, month: currentMonth },
  });

  const {
    data: reviewData,
    loading: reviewLoading,
    error: reviewError,
  } = useQuery<MonthlyReviewData>(MONTHLY_REVIEW_SUMMARY, {
    variables: { year: currentYear, month: currentMonth },
  });

  const {
    data: transactionsData,
    loading: transactionsLoading,
    error: transactionsError,
  } = useQuery<TransactionsData, TransactionsVariables>(DASHBOARD_TRANSACTIONS, {
    variables: {
      filters: {
        month: currentMonth,
        year: currentYear,
      },
    },
  });

  const aggregateSummary = aggregateData?.aggregateSummary;
  const monthlyReview = reviewData?.monthlyReview;

  const totalBalance = aggregateSummary?.netSavings ?? monthlyReview?.savings ?? 0;
  const budgetValue = monthlyReview?.totalIncome ?? aggregateSummary?.totalIncome ?? 0;
  const expenseValue = monthlyReview?.totalExpenses ?? aggregateSummary?.totalExpense ?? 0;
  const incomeValue = aggregateSummary?.totalIncome ?? monthlyReview?.totalIncome ?? 0;

  const overviewCards = [
    {
      title: 'Total Balance',
      value: totalBalance,
      delta: monthlyReview?.savings,
      deltaLabel: 'Saved this month',
      isPositive: (monthlyReview?.savings ?? 0) >= 0,
    },
    {
      title: 'Budget',
      value: budgetValue,
    },
    {
      title: 'Expenses',
      value: expenseValue,
    },
    {
      title: 'Income',
      value: incomeValue,
    },
  ];

  const categoryBreakdown = monthlyReview?.categoryBreakdown ?? [];

  const transactions = useMemo(
    () =>
      (transactionsData?.transactions?.items ?? []).map((item) => ({
        id: item.id,
        date: item.date,
        description: item.description ?? 'Untitled transaction',
        amount: item.amount,
        category: item.category ?? 'Uncategorized',
      })),
    [transactionsData]
  );

  const isLoading = summaryLoading || reviewLoading || transactionsLoading;
  const hasError = summaryError || reviewError || transactionsError;

  const periodLabel = now.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <section className="flex items-center justify-between text-left">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Dashboard Overview</h1>
            <p className="text-sm text-slate-500">Financial snapshot for {periodLabel}</p>
          </div>
          {isLoading && <span className="text-sm text-slate-500">Loading…</span>}
        </section>

        {hasError && (
          <div className="rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            Unable to load all dashboard data. Please try again.
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map(({ title, value, delta, deltaLabel, isPositive }) => (
            <OverviewCard
              key={title}
              title={title}
              value={value}
              delta={delta}
              deltaLabel={deltaLabel}
              isPositive={isPositive}
            />
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <BalanceCard
            balance={totalBalance}
            holderName="Household Budget"
            expiry={formatExpiry(currentYear, currentMonth)}
            cardType="Visa"
          />

          <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <header className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-slate-900">Spending Breakdown</h2>
              <p className="text-sm text-slate-500">Category distribution for {periodLabel}</p>
            </header>
            <div className="mt-4 flex justify-center">
              <ReportDonut items={categoryBreakdown} />
            </div>
          </section>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <header className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent Transactions</h2>
              <p className="text-xs text-slate-500">Showing latest activity for {periodLabel}</p>
            </div>
            {transactionsLoading && <span className="text-xs text-slate-500">Loading…</span>}
          </header>
          <TransactionsTable loading={transactionsLoading} transactions={transactions} />
        </section>
      </div>
    </DashboardLayout>
  );
}
