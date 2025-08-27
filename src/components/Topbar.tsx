import TenantSwitcher from './TenantSwitcher';


export default function Topbar() {
return (
<header className="h-14 border-b flex items-center justify-between px-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur">
<div className="text-sm text-zinc-500">Dashboard</div>
<div className="flex items-center gap-3">
<TenantSwitcher />
<button
className="rounded-xl border px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
onClick={() => document.documentElement.classList.toggle('dark')}
>
Toggle Theme
</button>
</div>
</header>
);
}