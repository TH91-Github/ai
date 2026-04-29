// src/main.tsx
// 역할: React 앱 진입점
// 주의: 전역 스타일은 여기서만 임포트

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { AuthProvider } from '@/contexts/AuthContext';
import '@/assets/styles/global.scss';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('#root element not found');

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
