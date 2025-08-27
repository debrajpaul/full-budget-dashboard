import { createBrowserRouter } from 'react-router-dom';
import Overview from '@/features/overview/Overview';
import Transactions from '@/features/transactions/Transactions';
import Goals from '@/features/goals/Goals';
import Settings from '@/features/settings/Settings';
import AppShell from '@/components/AppShell';
import Login from '@/features/auth/Login';
import RequireAuth from '@/features/auth/RequireAuth';


export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppShell>
          <Overview />
        </AppShell>
      </RequireAuth>
    ),
  },
  {
    path: '/transactions',
    element: (
      <RequireAuth>
        <AppShell>
          <Transactions />
        </AppShell>
      </RequireAuth>
    ),
  },
  {
    path: '/goals',
    element: (
      <RequireAuth>
        <AppShell>
          <Goals />
        </AppShell>
      </RequireAuth>
    ),
  },
  {
    path: '/settings',
    element: (
      <RequireAuth>
        <AppShell>
          <Settings />
        </AppShell>
      </RequireAuth>
    ),
  },
]);