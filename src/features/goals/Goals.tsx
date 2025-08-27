import { useQuery } from '@apollo/client';
import { SAVINGS_GOALS } from '@/graphql/queries';
import { useTenant } from '@/state/tenant';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import dayjs from 'dayjs';


function GoalCard({ goal }: { goal: any }) {
const pct = Math.min(100, Math.round(((goal.current || 0) / Math.max(1, goal.target || 1)) * 100));
return (
<div className="rounded-2xl border bg-white dark:bg-zinc-900 p-4 grid gap-3">
<div className="flex items-baseline justify-between">
<div className="text-lg font-semibold">{goal.name}</div>
<div className="text-sm text-zinc-500">Target: {goal.target?.toLocaleString()}</div>
</div>
<div className="w-full bg-zinc-200/60 dark:bg-zinc-800 rounded-full h-2">
<div className="bg-zinc-900 dark:bg-zinc-200 h-2 rounded-full" style={{ width: pct + '%' }} />
</div>
<div className="text-sm text-zinc-500">{pct}% • Deadline: {goal.deadline ? dayjs(goal.deadline).format('DD MMM YYYY') : '—'}</div>
<div className="h-40">
<ResponsiveContainer width="100%" height="100%">
<LineChart data={goal.history || []}>
<XAxis dataKey="date" tickFormatter={(d) => dayjs(d).format('DD/MM')} />
<YAxis />
<Tooltip labelFormatter={(d) => dayjs(d as string).format('DD MMM YYYY')} />
<Legend />
<Line type="monotone" dataKey="value" dot={false} />
</LineChart>
</ResponsiveContainer>
</div>
</div>
);
}


export default function Goals() {
const { tenantId } = useTenant();
const { data, loading } = useQuery(SAVINGS_GOALS, { skip: !tenantId, variables: { tenantId } });
if (!tenantId) return <div>Select a tenant to continue.</div>;
if (loading) return <div className="h-32 rounded-2xl bg-zinc-200/60 dark:bg-zinc-800 animate-pulse" />;
const goals = data?.savingsGoals ?? [];
return (
<div className="grid gap-4 md:grid-cols-2">
{goals.map((g: any) => <GoalCard key={g.id} goal={g} />)}
{!goals.length && <div className="text-sm text-zinc-500">No goals yet.</div>}
</div>
);
}