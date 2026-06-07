// =============================================================
// src/router/index.tsx
// 역할: 애플리케이션 라우팅 구조 정의
// =============================================================

import { Navigate, createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Layout from '@/components/layout/Layout';
import DraftPage from '@/pages/DraftPage';
import LoginPage from '@/pages/LoginPage';
import RegistryPage from '@/pages/RegistryPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/blog/draft" replace /> },
      { path: 'draft', element: <Navigate to="/blog/draft" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <Navigate to="/login" replace /> },
      { path: 'blog/draft', element: <DraftPage section="blog" /> },
      { path: 'song/draft', element: <DraftPage section="song" /> },
      { path: 'video/draft', element: <DraftPage section="video" /> },
      {
        path: 'blog/registry',
        element: (
          <ProtectedRoute>
            <RegistryPage section="blog" />
          </ProtectedRoute>
        ),
      },
      {
        path: 'song/registry',
        element: (
          <ProtectedRoute>
            <RegistryPage section="song" />
          </ProtectedRoute>
        ),
      },
      {
        path: 'video/registry',
        element: (
          <ProtectedRoute>
            <RegistryPage section="video" />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
