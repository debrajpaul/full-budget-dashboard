import { NavLink } from 'react-router-dom';

type NavigationItem = {
  label: string;
  to: string;
};

const primaryNavigation: NavigationItem[] = [
  { label: 'Dashboard', to: '/' },
  { label: 'Statistics', to: '/statistics' },
  { label: 'Transactions', to: '/transactions' },
];

const secondaryNavigation: NavigationItem[] = [
  { label: 'Help', to: '/help' },
  { label: 'Support', to: '/support' },
  { label: 'Settings', to: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-56 flex-col border-r border-gray-200 bg-white p-4">
      <div className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Full Budget</span>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      </div>

      <nav className="flex flex-1 flex-col gap-4">
        <SidebarSection title="Navigation" items={primaryNavigation} />
        <SidebarSection title="Support" items={secondaryNavigation} />
      </nav>
    </aside>
  );
}

type SidebarSectionProps = {
  title: string;
  items: NavigationItem[];
};

function SidebarSection({ title, items }: SidebarSectionProps) {
  return (
    <section>
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.label}>
            <SidebarLink {...item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function SidebarLink({ label, to }: NavigationItem) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 ${
          isActive ? 'bg-gray-200 text-gray-900' : ''
        }`
      }
    >
      {label}
    </NavLink>
  );
}
