import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import dayjs from 'dayjs';

export default function NetWorthChart({
  days,
}: {
  days: { date: string; runningBalance?: number | null }[];
}) {
  const data = (days || []).map((d) => ({ date: d.date, runningBalance: d.runningBalance ?? null }));
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" tickFormatter={(d) => dayjs(d).format('DD MMM')} />
          <YAxis />
          <Tooltip labelFormatter={(d) => dayjs(d as string).format('DD MMM YYYY')} />
          <Legend />
          <Line type="monotone" dataKey="runningBalance" name="Balance" stroke="#0ea5e9" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

