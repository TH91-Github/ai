// =============================================================
// src/components/auth/ProtectedRoute.tsx
// 역할: 로그인한 사용자만 접근 가능한 페이지 보호
// =============================================================

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import styles from './ProtectedRoute.module.scss';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className={styles.loadingBox}>
        <span className={styles.spinner} aria-hidden="true" />
        <span>로그인 상태를 확인하고 있어요.</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
