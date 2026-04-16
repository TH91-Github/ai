// =============================================================
// src/router/index.tsx
// 역할: 애플리케이션 라우팅 구조 정의
// =============================================================

import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import DraftPage from '@/pages/DraftPage';
import RegistryPage from '@/pages/RegistryPage';
import StatsPage from '@/pages/StatsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/draft" replace /> },
      { path: 'draft', element: <DraftPage /> },
      { path: 'registry', element: <RegistryPage /> },
      { path: 'stats', element: <StatsPage /> },
    ],
  },
]);
