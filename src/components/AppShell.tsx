import Sidebar from './Sidebar';
import Topbar from './Topbar';


export default function AppShell({ children }: { children: React.ReactNode }) {
return (
<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
<div className="flex">
<Sidebar />
<div className="flex-1 flex flex-col">
<Topbar />
<main className="p-6 grid gap-6">{children}</main>
</div>
</div>
</div>
);
}