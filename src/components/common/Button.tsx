// =============================================================
// src/components/common/Button.tsx
// 역할: 공통 버튼 컴포넌트
// 주요 기능: variant (primary, secondary, danger, ghost), size, loading 상태
// =============================================================

import React from 'react';
import styles from './Button.module.scss';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  ...rest
}) => {
  return (
    <button
      className={[
        styles.btn,
        styles[`btn--${variant}`],
        styles[`btn--${size}`],
        fullWidth ? styles['btn--full'] : '',
        loading ? styles['btn--loading'] : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      <span className={loading ? styles.hiddenText : ''}>{children}</span>
    </button>
  );
};

export default Button;
