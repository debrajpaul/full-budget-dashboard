import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TENANTS } from '@/graphql/queries';
import { useTenant } from '@/state/tenant';


export default function TenantSwitcher() {
const { data } = useQuery(GET_TENANTS);
const { tenantId, setTenantId, setTenants } = useTenant();


useEffect(() => {
if (data?.tenants) setTenants(data.tenants);
}, [data, setTenants]);


const tenants = data?.tenants ?? [];


return (
<select
className="rounded-xl border bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
value={tenantId ?? ''}
onChange={(e) => setTenantId(e.target.value)}
>
{tenants.map((t: any) => (
<option key={t.id} value={t.id}>{t.name}</option>
))}
</select>
);
}