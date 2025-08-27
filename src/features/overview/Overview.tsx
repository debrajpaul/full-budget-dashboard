import { useQuery } from '@apollo/client';
import { OVERVIEW } from '@/graphql/queries';
import KPI from '@/components/KPI';
import TrendChart from '@/components/TrendChart';
import { useTenant } from '@/state/tenant';


const now = new Date();


export default function Overview() {
const { tenantId } = useTenant();
const { data, loading } = useQuery(OVERVIEW, {
skip: !tenantId,
variables: { tenantId, month: now.getMonth() + 1, year: now.getFullYear() },
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