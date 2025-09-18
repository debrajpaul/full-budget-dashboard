import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faBullseye,
  faGaugeHigh,
  faGear,
  faRightFromBracket,
  faTableList,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/hooks/useAuth';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'flex h-12 w-12 items-center justify-center rounded-2xl text-xl transition-colors duration-150',
    isActive
      ? 'bg-white text-primary shadow-lg shadow-primary/20'
      : 'text-white/70 hover:text-white hover:bg-white/10',
  ].join(' ');

type NavItem = {
  to: string;
  icon: IconDefinition;
  end?: boolean;
};

const navItems: NavItem[] = [
  { to: '/', icon: faGaugeHigh, end: true },
  { to: '/transactions', icon: faTableList },
  { to: '/goals', icon: faBullseye },
  { to: '/settings', icon: faGear },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex min-h-screen bg-secondary">
      <aside className="flex h-screen w-20 flex-col items-center space-y-8 bg-primary py-6 text-white">
        <div className="text-lg font-semibold uppercase tracking-widest">FB</div>
        <nav className="flex flex-1 flex-col items-center space-y-6">
          {navItems.map(({ to, icon, end }) => (
            <NavLink key={to} to={to} end={end} className={navLinkClass}>
              <FontAwesomeIcon icon={icon} />
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl text-white/70 transition-colors duration-150 hover:bg-white/10 hover:text-white"
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      </aside>
      <main className="flex-1 overflow-y-auto bg-secondary p-8">
        {children}
      </main>
    </div>
  );
}
