import { createBrowserRouter } from 'react-router-dom';
import Overview from '@/features/overview/Overview';
import Transactions from '@/features/transactions/Transactions';
import Goals from '@/features/goals/Goals';
import Settings from '@/features/settings/Settings';
import AppShell from '@/components/AppShell';


export const router = createBrowserRouter([
{
path: '/',
element: (
<AppShell>
<Overview />
</AppShell>
),
},
{
path: '/transactions',
element: (
<AppShell>
<Transactions />
</AppShell>
),
},
{
path: '/goals',
element: (
<AppShell>
<Goals />
</AppShell>
),
},
{
path: '/settings',
element: (
<AppShell>
<Settings />
</AppShell>
),
},
]);