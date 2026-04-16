// =============================================================
// src/components/common/Input.tsx
// 역할: 공통 텍스트 입력 컴포넌트
// 주요 기능: label, error 메시지, 전체 너비 지원
// =============================================================

import React from 'react';
import styles from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  id,
  ...rest
}) => {
  const inputId = id ?? `input-${Math.random().toString(36).slice(2)}`;

  return (
    <div className={[styles.wrapper, fullWidth ? styles.full : ''].join(' ')}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[styles.input, error ? styles.inputError : '', className]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default Input;
