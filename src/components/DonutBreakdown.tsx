import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { categoryEmoji } from './category';

type Item = { name: string; amount: number };

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f43f5e'];

export default function DonutBreakdown({ items }: { items: Item[] }) {
  const data = (items || []).filter((i) => (i?.amount ?? 0) > 0).map((i) => ({ ...i, label: `${categoryEmoji(i.name)} ${i.name}` }));
  const total = data.reduce((s, i) => s + (i.amount || 0), 0);
  return (
    <div className="h-72">
      {data.length ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="label"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              isAnimationActive
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v: any) => [`${v}`, 'Amount']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full grid place-items-center text-sm text-zinc-500">No breakdown</div>
      )}
      {total > 0 && (
        <div className="mt-2 text-xs text-zinc-500 text-center">Total: {total.toLocaleString()}</div>
      )}
    </div>
  );
}

