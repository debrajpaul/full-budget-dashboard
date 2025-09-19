import { PropsWithChildren } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import DashboardLayout from '@/components/DashboardLayout';
import DashboardPage from '@/pages/Dashboard';
import LoginPage from '@/pages/Login';
import ComingSoon from '@/pages/ComingSoon';

function AuthGuard({ children }: PropsWithChildren) {
  const location = useLocation();
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('jwt') : null;

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <AuthGuard>
            <DashboardPage />
          </AuthGuard>
        }
      />
      <Route
        path="/statistics"
        element={
          <AuthGuard>
            <DashboardLayout>
              <ComingSoon />
            </DashboardLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/transactions"
        element={
          <AuthGuard>
            <DashboardLayout>
              <ComingSoon />
            </DashboardLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/help"
        element={
          <AuthGuard>
            <DashboardLayout>
              <ComingSoon />
            </DashboardLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/support"
        element={
          <AuthGuard>
            <DashboardLayout>
              <ComingSoon />
            </DashboardLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/settings"
        element={
          <AuthGuard>
            <DashboardLayout>
              <ComingSoon />
            </DashboardLayout>
          </AuthGuard>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
