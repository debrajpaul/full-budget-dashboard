import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from 'recharts';


export default function TrendChart({ data }: { data: { date: string; budget: number; actual: number }[] }) {
return (
<div className="h-64">
<ResponsiveContainer width="100%" height="100%">
<AreaChart data={data}>
<XAxis dataKey="date" />
<YAxis />
<Tooltip />
<Legend />
<Area type="monotone" dataKey="budget" fillOpacity={0.2} />
<Area type="monotone" dataKey="actual" fillOpacity={0.2} />
</AreaChart>
</ResponsiveContainer>
</div>
);
}