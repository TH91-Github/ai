// =============================================================
// src/pages/LoginPage.tsx
// 역할: Firebase 이메일/비밀번호 로그인 페이지
// =============================================================

import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useAuth } from '@/contexts/AuthContext';
import styles from './AuthPage.module.scss';

const getAuthErrorMessage = (error: unknown): string => {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';

  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
    return '이메일 또는 비밀번호를 확인해 주세요.';
  }
  if (code.includes('too-many-requests')) {
    return '요청이 너무 많아요. 잠시 후 다시 시도해 주세요.';
  }

  return '로그인 중 오류가 발생했어요.';
};

const LoginPage: React.FC = () => {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/registry';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('이메일과 비밀번호를 입력해 주세요.');
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.authShell}>
      <div className={styles.authPanel}>
        <div className={styles.header}>
          <h1>로그인</h1>
          <p>등록 목록, 종합 통계, 임시 페이지는 로그인 후 이용할 수 있어요.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="이메일"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="name@example.com"
            fullWidth
          />
          <Input
            label="비밀번호"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            placeholder="비밀번호"
            fullWidth
          />
          {error && <p className={styles.error}>{error}</p>}
          <Button type="submit" fullWidth size="lg" loading={submitting}>
            로그인
          </Button>
        </form>

        <p className={styles.switchText}>
          계정이 없나요? <Link to="/signup">회원가입</Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
