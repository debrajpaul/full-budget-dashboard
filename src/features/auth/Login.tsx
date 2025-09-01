import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Navigate, useNavigate } from 'react-router-dom';
import { LOGIN } from '@/graphql/mutations';
import { useTenant } from '@/state/tenant';
import { GET_TENANTS } from '@/graphql/queries';

export default function Login() {
  const navigate = useNavigate();
  const { tenantId: currentTenantId, setTenantId } = useTenant();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantId, setTenantIdInput] = useState(currentTenantId ?? '');
  const { data: tenantsData, loading: tenantsLoading, error: tenantsError } = useQuery(GET_TENANTS);
  const [login, { loading, error }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data?.login?.token;
      const returnedTenantId = data?.login?.user?.tenantId;
      if (token) {
        localStorage.setItem('jwt', token);
        if (returnedTenantId) setTenantId(returnedTenantId);
        navigate('/');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ variables: { value: { email, password, tenantId } } });
  };

  useEffect(() => {
    if (!tenantId && tenantsData?.tenants?.length) {
      setTenantIdInput(tenantsData.tenants[0].id);
    }
  }, [tenantId, tenantsData]);

  if (localStorage.getItem('jwt')) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-md grid gap-4 w-80"
      >
        <h1 className="text-xl font-semibold text-center">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <select
          value={tenantId}
          onChange={(e) => setTenantIdInput(e.target.value)}
          className="border rounded px-3 py-2 bg-white dark:bg-zinc-900"
          disabled={tenantsLoading}
        >
          {tenantsLoading && <option>Loading tenants...</option>}
          {!tenantsLoading && !tenantsData?.tenants?.length && (
            <option value="">No tenants available</option>
          )}
          {!tenantsLoading && tenantsData?.tenants?.map((t: any) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        {tenantsError && (
          <div className="text-sm text-red-600">{tenantsError.message}</div>
        )}
        {error && (
          <div className="text-sm text-red-600">{error.message}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl border px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
