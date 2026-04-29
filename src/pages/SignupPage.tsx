// =============================================================
// src/pages/SignupPage.tsx
// 역할: Firebase 이메일/비밀번호 회원가입 페이지
// =============================================================

import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useAuth } from '@/contexts/AuthContext';
import styles from './AuthPage.module.scss';

const getSignupErrorMessage = (error: unknown): string => {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';

  if (code.includes('email-already-in-use')) {
    return '이미 가입된 이메일이에요.';
  }
  if (code.includes('invalid-email')) {
    return '이메일 형식을 확인해 주세요.';
  }
  if (code.includes('weak-password')) {
    return '비밀번호는 6자 이상으로 입력해 주세요.';
  }

  return '회원가입 중 오류가 발생했어요.';
};

const SignupPage: React.FC = () => {
  const { user, loading, signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to="/registry" replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password || !passwordConfirm) {
      setError('이메일과 비밀번호를 모두 입력해 주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('비밀번호가 서로 달라요.');
      return;
    }

    setSubmitting(true);
    try {
      await signup(email.trim(), password);
      navigate('/registry', { replace: true });
    } catch (err) {
      setError(getSignupErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.authShell}>
      <div className={styles.authPanel}>
        <div className={styles.header}>
          <h1>회원가입</h1>
          <p>이메일과 비밀번호로 계정을 만들 수 있어요.</p>
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
            autoComplete="new-password"
            placeholder="6자 이상"
            fullWidth
          />
          <Input
            label="비밀번호 확인"
            type="password"
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            autoComplete="new-password"
            placeholder="비밀번호 재입력"
            fullWidth
          />
          {error && <p className={styles.error}>{error}</p>}
          <Button type="submit" fullWidth size="lg" loading={submitting}>
            회원가입
          </Button>
        </form>

        <p className={styles.switchText}>
          이미 계정이 있나요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </section>
  );
};

export default SignupPage;
