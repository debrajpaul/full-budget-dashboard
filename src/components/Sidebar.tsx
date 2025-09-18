import { NavLink } from 'react-router-dom';
import { GoalsIcon, OverviewIcon, SettingsIcon, TransactionsIcon } from './Icon';

const nav = [
  { to: '/', label: 'Overview', icon: OverviewIcon },
  { to: '/transactions', label: 'Transactions', icon: TransactionsIcon },
  { to: '/goals', label: 'Goals', icon: GoalsIcon },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function Sidebar() {
  return (
    <aside className="flex flex-col w-56 h-screen bg-cardBg border-r border-gray-200 py-6 px-4">
      <h1 className="text-primary text-2xl font-bold mb-10">Finance</h1>
      <nav className="flex-1 space-y-2">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white shadow'
                    : 'text-primary hover:bg-gray-100 hover:text-primary'
                }`
              }
            >
              <Icon />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
