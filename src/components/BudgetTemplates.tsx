import { currency } from '@/lib/format';
import { categoryEmoji } from './category';

type TemplateItem = { name: string; percent: number };

function TemplateList({ title, items, income }: { title: string; items: TemplateItem[]; income: number }) {
  const totalPct = items.reduce((s, i) => s + i.percent, 0);
  return (
    <div className="rounded-2xl border bg-white dark:bg-zinc-900 p-4">
      <div className="mb-2 text-sm text-zinc-500">{title} • Using income {currency(income)}</div>
      <div className="grid gap-2">
        {items.map((i) => (
          <div key={i.name} className="flex items-center gap-2 text-sm">
            <span className="text-base" aria-hidden>{categoryEmoji(i.name)}</span>
            <span className="flex-1">{i.name}</span>
            <span className="tabular-nums text-zinc-500">{i.percent}%</span>
            <span className="w-28 text-right font-medium">{currency((income * i.percent) / 100)}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-zinc-500">Total: {totalPct}%</div>
      <div className="mt-3">
        <button
          className="rounded-xl border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
          onClick={() => {
            const rows = items.map((i) => ({ name: i.name, percent: i.percent, amount: Math.round((income * i.percent) / 100) }));
            const csv = ['name,percent,amount', ...rows.map((r) => `${r.name},${r.percent},${r.amount}`)].join('\n');
            navigator.clipboard?.writeText(csv);
          }}
        >
          Copy CSV
        </button>
      </div>
    </div>
  );
}

export default function BudgetTemplates({ income }: { income: number }) {
  const rule503020: TemplateItem[] = [
    { name: 'Needs', percent: 50 },
    { name: 'Wants', percent: 30 },
    { name: 'Savings', percent: 20 },
  ];

  const indiaStarter: TemplateItem[] = [
    { name: 'EMI', percent: 20 },
    { name: 'Rent', percent: 20 },
    { name: 'Groceries', percent: 10 },
    { name: 'Utilities', percent: 5 },
    { name: 'Tuition', percent: 5 },
    { name: 'Fuel', percent: 5 },
    { name: 'Transport', percent: 5 },
    { name: 'UPI Transfers', percent: 5 },
    { name: 'Savings/Investments', percent: 20 },
    { name: 'Entertainment', percent: 3 },
    { name: 'Misc', percent: 2 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <TemplateList title="50/30/20 Rule" items={rule503020} income={income} />
      <TemplateList title="India Starter" items={indiaStarter} income={income} />
    </div>
  );
}

