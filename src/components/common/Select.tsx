// =============================================================
// src/components/common/Select.tsx
// 역할: 공통 셀렉트(드롭다운) 컴포넌트
// 주요 기능: label, error, options 배열 지원
// =============================================================

import React from 'react';
import styles from './Select.module.scss';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  fullWidth?: boolean;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  fullWidth = false,
  placeholder,
  className = '',
  id,
  ...rest
}) => {
  const selectId = id ?? `select-${Math.random().toString(36).slice(2)}`;

  return (
    <div className={[styles.wrapper, fullWidth ? styles.full : ''].join(' ')}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.selectWrap}>
        <select
          id={selectId}
          className={[styles.select, error ? styles.selectError : '', className]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className={styles.arrow} aria-hidden="true">▾</span>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default Select;
