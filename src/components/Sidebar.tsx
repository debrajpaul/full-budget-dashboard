import { NavLink } from 'react-router-dom';


const nav = [
{ to: '/', label: 'Overview' },
{ to: '/transactions', label: 'Transactions' },
{ to: '/goals', label: 'Goals' },
{ to: '/settings', label: 'Settings' },
];


export default function Sidebar() {
return (
<aside className="w-60 shrink-0 border-r bg-white dark:bg-zinc-900">
<div className="p-4 text-lg font-semibold">Finance</div>
<nav className="px-2 py-1 space-y-1">
{nav.map((n) => (
<NavLink
key={n.to}
to={n.to}
className={({ isActive }) =>
`block rounded-xl px-3 py-2 text-sm ${isActive ? 'bg-zinc-100 dark:bg-zinc-800 font-medium' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'}`
}
>
{n.label}
</NavLink>
))}
</nav>
</aside>
);
}