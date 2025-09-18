import { ReactNode, useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faArrowTrendUp, faMoneyBillWave, faPiggyBank } from '@fortawesome/free-solid-svg-icons';
import { Card } from '@/components/Card';
import { KpiCard } from '@/components/KpiCard';
import RecentTransactions from '@/components/RecentTransactions';
import {
  AGGREGATE_SUMMARY,
  MONTHLY_REVIEW,
  SAVINGS_GOALS,
} from '@/graphql/queries';
import { usePreferences } from '@/hooks/usePreferences';
import { useAuth } from '@/hooks/useAuth';
import { currency } from '@/lib/format';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const pieColors = ['#0052cc', '#36b37e', '#6554c0', '#172b4d'];

const monthOptions = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export default function Dashboard() {
  const { preferences, setPreference } = usePreferences();
  const { user } = useAuth();
  const month = preferences.selectedMonth;
  const year = preferences.selectedYear;

  const {
    data: summaryData,
    loading: summaryLoading,
    error: summaryError,
  } = useQuery(AGGREGATE_SUMMARY, {
    variables: { month, year },
  });

  const {
    data: reviewData,
    loading: reviewLoading,
    error: reviewError,
  } = useQuery(MONTHLY_REVIEW, {
    variables: { month, year },
  });

  const {
    data: goalsData,
    loading: goalsLoading,
    error: goalsError,
  } = useQuery(SAVINGS_GOALS);

  const summary = summaryData?.aggregateSummary;
  const review = reviewData?.monthlyReview;
  const goals = goalsData?.savingsGoals ?? [];

  const reviewSeries = review?.series ?? [];
  const categoryBreakdown = review?.categoryBreakdown ?? [];
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const options = new Set<number>();
    for (let i = 0; i < 6; i += 1) {
      options.add(currentYear - i);
    }
    options.add(year);
    return Array.from(options).sort((a, b) => b - a);
  }, [year]);

  const handleMonthChange = useCallback(
    (nextMonth: number) => {
      const clamped = Math.min(Math.max(nextMonth, 1), 12);
      setPreference('selectedMonth', clamped);
    },
    [setPreference]
  );

  const handleYearChange = useCallback(
    (nextYear: number) => {
      if (!Number.isFinite(nextYear)) return;
      setPreference('selectedYear', nextYear);
    },
    [setPreference]
  );

  const chartData = useMemo(() => {
    if (!summary) return [];
    const totalIncome = summary.totalIncome ?? 0;
    const totalExpense = summary.totalExpense ?? summary.totalExpenses ?? 0;
    const netSavings = summary.netSavings ?? summary.savings ?? 0;
    return [
      { name: 'Income', value: totalIncome, fill: '#36b37e' },
      { name: 'Expense', value: totalExpense, fill: '#ff5630' },
      { name: 'Savings', value: netSavings, fill: '#6554c0' },
    ];
  }, [summary]);

  return (
    <div className="space-y-8">
      <Card as="section" padding="lg">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-primary sm:text-3xl">
              Good morning, {user?.name || 'Friend'}!
            </h1>
            <p className="text-gray-600">
              Here’s a quick overview of your finances for the selected period.
            </p>
          </div>
          <PeriodSelector
            month={month}
            year={year}
            yearOptions={yearOptions}
            onMonthChange={handleMonthChange}
            onYearChange={handleYearChange}
          />
        </div>
      </Card>

      <Card as="section" padding="lg" className="space-y-4">
        <header>
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">Key metrics</h2>
        </header>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
          <SummaryCard
            label="Income"
            value={summary?.totalIncome ?? 0}
            loading={summaryLoading && !summary}
            icon={faArrowTrendUp}
          />
          <SummaryCard
            label="Expenses"
            value={summary?.totalExpense ?? summary?.totalExpenses ?? 0}
            loading={summaryLoading && !summary}
            icon={faMoneyBillWave}
          />
          <SummaryCard
            label="Net savings"
            value={summary?.netSavings ?? summary?.savings ?? 0}
            loading={summaryLoading && !summary}
            icon={faPiggyBank}
          />
        </div>
        {summaryError && (
          <p className="text-sm text-red-600">Failed to load financial summary.</p>
        )}
      </Card>

      <Card as="section" padding="lg">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <KpiCard label="Total Income" value={summary?.totalIncome ?? 0} color="income" />
          <KpiCard label="Total Expense" value={summary?.totalExpense ?? summary?.totalExpenses ?? 0} color="expense" />
          <KpiCard label="Net Savings" value={summary?.netSavings ?? summary?.savings ?? 0} color="savings" />
        </div>
      </Card>

      <Card as="section" padding="lg" className="space-y-6">
        <header className="space-y-1">
          <h2 className="text-lg font-semibold text-zinc-900">Income, expenses & savings</h2>
          <p className="text-sm text-zinc-600">Visualize the share of your earnings, spending, and leftover savings.</p>
        </header>
        <div className="flex min-h-[300px] items-center justify-center">
          {summaryLoading && !summary ? (
            <Placeholder message="Loading financial summary..." />
          ) : summaryError ? (
            <Placeholder message="Unable to fetch financial summary." tone="error" />
          ) : chartData.length ? (
            <PieChart width={300} height={300}>
              <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} label />
              <Tooltip
                formatter={(value: number | string) => {
                  const numericValue = typeof value === 'number' ? value : Number(value);
                  const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
                  return `₹${safeValue.toFixed(2)}`;
                }}
              />
            </PieChart>
          ) : (
            <Placeholder message="No summary data available." />
          )}
        </div>
      </Card>

      <RecentTransactions month={month} year={year} />

      {preferences.showBudgetVsActual && (
        <Card as="section" padding="lg" className="space-y-6">
          <header className="space-y-1">
            <h2 className="text-lg font-semibold text-zinc-900">Budget vs actual</h2>
            <p className="text-sm text-zinc-600">Track how spending aligns with planned budget.</p>
          </header>
          <div className="h-72">
            {reviewLoading && !review ? (
              <Placeholder message="Loading monthly review..." />
            ) : reviewError ? (
              <Placeholder message="Unable to fetch monthly review." tone="error" />
            ) : reviewSeries.length ? (
              <ResponsiveContainer>
                <LineChart data={reviewSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" tickFormatter={(v) => currency(v).replace(/\.00$/, '')} />
                  <Tooltip formatter={(value: number) => currency(value)} labelStyle={{ color: '#111827' }} />
                  <Legend />
                  <Line type="monotone" dataKey="budget" stroke="#0052cc" strokeWidth={2} dot={false} name="Budget" />
                  <Line type="monotone" dataKey="actual" stroke="#36b37e" strokeWidth={2} dot={false} name="Actual" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Placeholder message="No budget data yet." />
            )}
          </div>
        </Card>
      )}

      {preferences.showCategoryBreakdown && (
        <Card as="section" padding="lg" className="space-y-6">
          <header className="space-y-1">
            <h2 className="text-lg font-semibold text-zinc-900">Category breakdown</h2>
            <p className="text-sm text-zinc-600">See where your money is going.</p>
          </header>
          <div className="h-72">
            {reviewLoading && !review ? (
              <Placeholder message="Loading breakdown..." />
            ) : reviewError ? (
              <Placeholder message="Unable to fetch category breakdown." tone="error" />
            ) : categoryBreakdown.length ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    dataKey="amount"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => currency(value)} />
                  <Legend layout="vertical" align="right" verticalAlign="middle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Placeholder message="No category data available." />
            )}
          </div>
        </Card>
      )}

      {preferences.showSavingsGoals && (
        <Card as="section" padding="lg" className="space-y-6">
          <header className="space-y-1">
            <h2 className="text-lg font-semibold text-zinc-900">Savings goals</h2>
            <p className="text-sm text-zinc-600">Monitor progress against each target.</p>
          </header>
          {!goalsLoading && !goalsError && goals.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {goals.map((goal) => {
                const target = typeof goal.target === 'number' ? goal.target : Number(goal.target) || 0;
                const current = typeof goal.current === 'number' ? goal.current : Number(goal.current) || 0;
                const progressPercent = target > 0 ? (current / target) * 100 : 0;
                const safeProgress = Math.min(Math.max(progressPercent, 0), 100);

                return (
                  <div key={goal.id} className="rounded-lg bg-white p-4 shadow-sm">
                    <h4 className="mb-2 font-semibold text-primary">{goal.name}</h4>
                    <p className="text-sm text-gray-500">Target: ₹{target.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Current: ₹{current.toFixed(2)}</p>
                    <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-income"
                        style={{ width: `${safeProgress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <Card
            className="overflow-x-auto border border-zinc-200"
            padding="md"
          >
            <table className="min-w-[640px] w-full divide-y divide-zinc-200">
              <thead className="bg-zinc-50">
                <tr>
                  <Th>Goal</Th>
                  <Th>Target</Th>
                  <Th>Current</Th>
                  <Th>Progress</Th>
                  <Th>Deadline</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {goalsLoading && !goals.length ? (
                  <tr>
                    <Td colSpan={5}>
                      <Placeholder message="Loading goals..." />
                    </Td>
                  </tr>
                ) : goalsError ? (
                  <tr>
                    <Td colSpan={5}>
                      <Placeholder message="Unable to load savings goals." tone="error" />
                    </Td>
                  </tr>
                ) : goals.length ? (
                  goals.map((goal) => {
                    const target = goal.target ?? 0;
                    const current = goal.current ?? 0;
                    const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;
                    const deadline = goal.deadline ? new Date(goal.deadline).toLocaleDateString() : '—';

                    return (
                      <tr key={goal.id} className="hover:bg-zinc-50">
                        <Td>{goal.name}</Td>
                        <Td>{currency(target)}</Td>
                        <Td>{currency(current)}</Td>
                        <Td>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-full rounded-full bg-zinc-200">
                              <div
                                className="h-full rounded-full bg-green-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-zinc-500">{progress.toFixed(0)}%</span>
                          </div>
                        </Td>
                        <Td>{deadline}</Td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <Td colSpan={5}>
                      <Placeholder message="Create your first goal to see progress." />
                    </Td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </Card>
      )}
    </div>
  );
}

function PeriodSelector({
  month,
  year,
  onMonthChange,
  onYearChange,
  yearOptions,
}: {
  month: number;
  year: number;
  onMonthChange: (value: number) => void;
  onYearChange: (value: number) => void;
  yearOptions: number[];
}) {
  return (
    <div className="flex w-full flex-wrap gap-4 rounded-lg bg-white p-4 shadow-sm sm:w-auto sm:items-end">
      <div className="flex min-w-[160px] flex-1 flex-col gap-1">
        <label
          htmlFor="dashboard-month"
          className="text-xs font-semibold uppercase tracking-wide text-zinc-500"
        >
          Month
        </label>
        <select
          id="dashboard-month"
          value={String(month)}
          onChange={(event) => onMonthChange(Number(event.target.value))}
          className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          {monthOptions.map(({ value, label }) => (
            <option key={value} value={String(value)}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex min-w-[140px] flex-1 flex-col gap-1">
        <label
          htmlFor="dashboard-year"
          className="text-xs font-semibold uppercase tracking-wide text-zinc-500"
        >
          Year
        </label>
        <select
          id="dashboard-year"
          value={String(year)}
          onChange={(event) => onYearChange(Number(event.target.value))}
          className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          {yearOptions.map((optionYear) => (
            <option key={optionYear} value={String(optionYear)}>
              {optionYear}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  loading,
  icon,
}: {
  label: string;
  value: number;
  loading?: boolean;
  icon: IconDefinition;
}) {
  return (
    <div className="flex h-full flex-col justify-between rounded-lg bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-medium uppercase text-zinc-500">{label}</div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <FontAwesomeIcon icon={icon} />
        </div>
      </div>
      <div className="mt-3 text-2xl font-semibold text-zinc-900">
        {loading ? '—' : currency(value)}
      </div>
    </div>
  );
}

function Placeholder({ message, tone = 'default' }: { message: string; tone?: 'default' | 'error' }) {
  const toneClass = tone === 'error' ? 'text-red-600' : 'text-gray-500';
  return (
    <div className={`flex h-full w-full items-center justify-center p-6 text-sm text-center ${toneClass}`}>
      {message}
    </div>
  );
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
      {children}
    </th>
  );
}

function Td({ children, colSpan }: { children: ReactNode; colSpan?: number }) {
  return (
    <td className="px-4 py-3 text-sm text-zinc-700" colSpan={colSpan}>
      {children}
    </td>
  );
}
