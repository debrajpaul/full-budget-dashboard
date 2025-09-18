import { useQuery } from '@apollo/client';
import { HEALTH_CHECK } from '@/graphql/queries';
import ErrorPage from '@/components/ErrorPage';

export default function HealthGate({ children }: { children: React.ReactNode }) {
  const { data, loading, error } = useQuery(HEALTH_CHECK, { fetchPolicy: 'no-cache' });
  console.log('Health check data:', data);
  console.log('Health check loading:', loading);
  console.log('Health check error:', error);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-sm text-zinc-600 dark:text-zinc-300">Checking server health…</div>
      </div>
    );
  }

  if (error) {
    const networkError: any = (error as any).networkError;
    const statusCode = networkError?.statusCode;
    const isOk = statusCode === 200;
    if (!isOk) {
      const message =
        statusCode === 403
          ? 'Forbidden (403): The API rejected the request. If your API requires an API key or auth on healthCheck, set VITE_API_KEY or adjust auth to allow health checks.'
          : error.message;
      return (
        <ErrorPage
          title={statusCode ? `Error ${statusCode}` : 'Connection Error'}
          message={message}
        />
      );
    }
  }

  if (data) return <>{children}</>;

  // Fallback: render a generic error
  return <ErrorPage />;
}
