import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Header from './Header';


type AppShellProps = {
  title: string;
  children: React.ReactNode;
};


export default function AppShell({ title, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar title={title} />
          <Header />
          <main className="grid gap-6 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
