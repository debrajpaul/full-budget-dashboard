import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('jwt');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
