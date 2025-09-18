import React from 'react';
import { ResponsiveContainer, Sankey, Tooltip } from 'recharts';

type Breakdown = { name: string; amount: number };

export default function SankeyFlow({
  totalIncome = 0,
  savings = 0,
  breakdown = [],
}: {
  totalIncome?: number;
  savings?: number;
  breakdown?: Breakdown[];
}) {
  // Build nodes: [Income, ...Categories, Savings]
  const categories = (breakdown || []).filter((c) => (c?.amount ?? 0) > 0);
  const nodes = [
    { name: 'Income' },
    ...categories.map((c) => ({ name: c.name })),
    { name: 'Savings' },
  ];

  // Links from Income (0) to categories (1..n), and optional Savings (last)
  const savingsValue = Math.max(0, savings || 0);
  const categoryLinks = categories.map((c, idx) => ({
    source: 0,
    target: 1 + idx,
    value: Math.max(0, c.amount || 0),
  }));
  const savingsLink = savingsValue > 0 ? [{ source: 0, target: nodes.length - 1, value: savingsValue }] : [];

  const data = {
    nodes,
    links: [...categoryLinks, ...savingsLink],
  } as any;

  const hasFlow = data.links.some((l: any) => (l?.value ?? 0) > 0);

  return (
    <div className="h-72">
      {hasFlow ? (
        <ResponsiveContainer width="100%" height="100%">
          <Sankey
            data={data}
            nodePadding={24}
            nodeWidth={16}
            margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
            linkCurvature={0.5}
          >
            <Tooltip formatter={(v: any) => [v, 'Amount']} />
          </Sankey>
        </ResponsiveContainer>
      ) : (
        <div className="h-full grid place-items-center text-sm text-zinc-500">No flow data</div>
      )}
    </div>
  );
}

