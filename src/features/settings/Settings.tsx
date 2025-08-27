export default function Settings() {
return (
<div className="grid gap-4">
<div className="rounded-2xl border bg-white dark:bg-zinc-900 p-4">
<div className="text-lg font-semibold mb-2">Profile</div>
<div className="text-sm text-zinc-500">Timezone, currency format, and preferences will live here.</div>
</div>
<div className="rounded-2xl border bg-white dark:bg-zinc-900 p-4">
<div className="text-lg font-semibold mb-2">Billing</div>
<div className="text-sm text-zinc-500">Connect your billing portal (e.g., Stripe) here.</div>
</div>
</div>
);
}