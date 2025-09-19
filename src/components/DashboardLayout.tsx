import { ReactNode } from 'react';

import Header from './Header';
import Sidebar from './Sidebar';

type DashboardLayoutProps = {
  children: ReactNode;
  mainClassName?: string;
};

export default function DashboardLayout({ children, mainClassName }: DashboardLayoutProps) {
  const composedMainClassName = ['flex flex-1 flex-col overflow-y-auto bg-gray-50 p-4 md:p-6', mainClassName]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="flex min-h-screen bg-gray-50 text-slate-900">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className={composedMainClassName}>
          {children}
        </main>
      </div>
    </div>
  );
}
