import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { OVERVIEW } from '@/graphql/queries';
import KPI from '@/components/KPI';
import TrendChart from '@/components/TrendChart';
import { useTenant } from '@/state/tenant';


const now = new Date();


export default function Overview() {
const { tenantId } = useTenant();
const [month, setMonth] = useState<number>(now.getMonth() + 1);
const [year, setYear] = useState<number>(now.getFullYear());
// Variables actually used for the query (update only on Search click)
const [queryMonth, setQueryMonth] = useState<number>(month);
const [queryYear, setQueryYear] = useState<number>(year);
const [filters, setFilters] = useState<{ from: string; to: string }>({ from: '', to: '' });
const { data, loading } = useQuery(OVERVIEW, {
  variables: { month: queryMonth, year: queryYear },
});


if (!tenantId) return <div>Select a tenant to continue.</div>;


if (loading) {
return (
<div className="grid gap-4 md:grid-cols-4">
{Array.from({ length: 4 }).map((_, i) => (
<div key={i} className="h-28 rounded-2xl bg-zinc-200/60 dark:bg-zinc-800 animate-pulse" />
))}
</div>
);
}


const r = data?.monthlyReview ?? {};
const kpis = [
{ label: 'Income', value: r.totalIncome ?? 0 },
{ label: 'Expenses', value: r.totalExpenses ?? 0 },
{ label: 'Savings', value: r.savings ?? 0 },
{ label: 'Savings Rate', value: r.totalIncome ? 1 - (r.totalExpenses || 0) / r.totalIncome : 0, fmt: (v:number)=>`${(v*100).toFixed(1)}%` },
];


return (
<div className="grid gap-6">
<div className="rounded-2xl border bg-white dark:bg-zinc-900 p-4 grid gap-3">
  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
    <input
      type="date"
      className="rounded-xl border px-3 py-2 bg-white dark:bg-zinc-950"
      value={filters.from}
      onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
    />
    <input
      type="date"
      className="rounded-xl border px-3 py-2 bg-white dark:bg-zinc-950"
      value={filters.to}
      onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
    />
    <button
      className="rounded-xl border px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
      onClick={() => {
        const base = filters.from || filters.to || new Date().toISOString().slice(0, 10);
        const d = new Date(base);
        const nextMonth = d.getMonth() + 1;
        const nextYear = d.getFullYear();
        setQueryMonth(nextMonth);
        setQueryYear(nextYear);
      }}
      disabled={loading}
    >
      {loading ? 'Searching…' : 'Apply Filters'}
    </button>
  </div>
</div>
<div className="grid gap-4 grid-cols-2 md:grid-cols-4">
{kpis.map(k => <KPI key={k.label} label={k.label} value={k.value} fmt={k.fmt as any} />)}
</div>


<div className="rounded-2xl border bg-white dark:bg-zinc-900 p-4">
<div className="mb-2 text-sm text-zinc-500">Budget vs Actual</div>
<TrendChart data={r.series ?? []} />
</div>
</div>
);
}
