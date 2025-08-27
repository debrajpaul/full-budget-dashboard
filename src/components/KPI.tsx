import { currency } from '@/lib/format';


export default function KPI({ label, value, fmt }: { label: string; value: number; fmt?: (v:number)=>string }) {
return (
<div className="rounded-2xl border bg-white dark:bg-zinc-900 p-4">
<div className="text-sm text-zinc-500">{label}</div>
<div className="text-2xl font-semibold mt-1">{fmt ? fmt(value) : currency(value)}</div>
</div>
);
}