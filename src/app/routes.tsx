import { createBrowserRouter } from 'react-router-dom';
import Overview from '@/features/overview/Overview';
import Transactions from '@/features/transactions/Transactions';
import Goals from '@/features/goals/Goals';
import Settings from '@/features/settings/Settings';
import AppShell from '@/components/AppShell';
import Login from '@/features/auth/Login';
import RequireAuth from '@/features/auth/RequireAuth';
import HealthGate from '@/features/auth/HealthGate';


export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <HealthGate>
        <Login />
      </HealthGate>
    ),
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppShell title="Overview">
          <Overview />
        </AppShell>
      </RequireAuth>
    ),
  },
  {
    path: '/transactions',
    element: (
      <RequireAuth>
        <AppShell title="Transactions">
          <Transactions />
        </AppShell>
      </RequireAuth>
    ),
  },
  {
    path: '/goals',
    element: (
      <RequireAuth>
        <AppShell title="Goals">
          <Goals />
        </AppShell>
      </RequireAuth>
    ),
  },
  {
    path: '/settings',
    element: (
      <RequireAuth>
        <AppShell title="Settings">
          <Settings />
        </AppShell>
      </RequireAuth>
    ),
  },
]);
