// =============================================================
// src/router/index.tsx
// 역할: 애플리케이션 라우팅 구조 정의
// =============================================================

import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Layout from '@/components/layout/Layout';
import DraftPage from '@/pages/DraftPage';
import LoginPage from '@/pages/LoginPage';
import RegistryPage from '@/pages/RegistryPage';
import SignupPage from '@/pages/SignupPage';
import StatsPage from '@/pages/StatsPage';
import TempPage from '@/pages/TempPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <DraftPage /> },
      { path: 'draft', element: <DraftPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      {
        path: 'registry',
        element: (
          <ProtectedRoute>
            <RegistryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'stats',
        element: (
          <ProtectedRoute>
            <StatsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'temp',
        element: (
          <ProtectedRoute>
            <TempPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
