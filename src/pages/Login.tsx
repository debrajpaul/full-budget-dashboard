import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Navigate, useNavigate } from 'react-router-dom';
import { LOGIN_MUTATION } from '@/graphql/mutations';
import { GET_TENANTS } from '@/graphql/queries';
import { useAuth } from '@/hooks/useAuth';
import { useTenant } from '@/state/tenant';

type LoginFormState = {
  email: string;
  password: string;
  tenantId: string;
};

export default function Login() {
  const navigate = useNavigate();
  const { login, token } = useAuth();
  const { tenantId: storedTenantId, setTenantId } = useTenant();
  const [formState, setFormState] = useState<LoginFormState>({
    email: '',
    password: '',
    tenantId: storedTenantId ?? '',
  });
  const { data: tenantsData, loading: tenantsLoading, error: tenantsError } = useQuery(GET_TENANTS);
  const [authenticate, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (result) => {
      const authPayload = result?.login;
      const authToken = authPayload?.token;
      const authUser = authPayload?.user;

      if (authToken && authUser) {
        login(authToken, authUser);
        if (authUser.tenantId) setTenantId(authUser.tenantId);
        navigate('/', { replace: true });
      }
    },
  });

  useEffect(() => {
    if (!formState.tenantId) {
      const firstTenant = tenantsData?.tenants?.[0]?.id;
      if (firstTenant) {
        setFormState((prev) => ({ ...prev, tenantId: firstTenant }));
      }
    }
  }, [formState.tenantId, tenantsData]);

  if (token) return <Navigate to="/" replace />;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    authenticate({ variables: { input: formState } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 rounded-xl bg-white p-10 shadow-lg dark:bg-zinc-900"
      >
        <div className="text-center">
          <span className="text-2xl font-bold text-primary dark:text-white">Full Budget</span>
        </div>
        <header className="space-y-1 text-center">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Log in</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Access your budgeting workspace</p>
        </header>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formState.email}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/40 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={formState.password}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/40 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="tenantId" className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Workspace
          </label>
          <select
            id="tenantId"
            name="tenantId"
            required
            value={formState.tenantId}
            onChange={handleInputChange}
            disabled={tenantsLoading}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/40 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-75"
          >
            {tenantsLoading && <option>Loading...</option>}
            {!tenantsLoading && tenantsData?.tenants?.length ? (
              tenantsData.tenants.map((tenant: { id: string; name: string }) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </option>
              ))
            ) : (
              !tenantsLoading && <option value="">No tenants found</option>
            )}
          </select>
        </div>

        {(tenantsError || error) && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
            {tenantsError?.message ?? error?.message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || tenantsLoading}
          className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-80 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
