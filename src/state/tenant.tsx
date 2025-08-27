import { createContext, useContext, useEffect, useMemo, useState } from 'react';


export type Tenant = { id: string; name: string };


interface TenantContextValue {
tenantId: string | null;
setTenantId: (id: string) => void;
tenants: Tenant[];
setTenants: (t: Tenant[]) => void;
}


const TenantContext = createContext<TenantContextValue | undefined>(undefined);


export function TenantProvider({ children }: { children: React.ReactNode }) {
const [tenantId, setTenantIdState] = useState<string | null>(() => localStorage.getItem('tenantId'));
const [tenants, setTenants] = useState<Tenant[]>([]);


const setTenantId = (id: string) => {
localStorage.setItem('tenantId', id);
setTenantIdState(id);
};


useEffect(() => {
if (!tenantId && tenants.length > 0) setTenantId(tenants[0].id);
}, [tenantId, tenants]);


const value = useMemo(() => ({ tenantId, setTenantId, tenants, setTenants }), [tenantId, tenants]);
return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}


export function useTenant() {
const ctx = useContext(TenantContext);
if (!ctx) throw new Error('useTenant must be used within TenantProvider');
return ctx;
}