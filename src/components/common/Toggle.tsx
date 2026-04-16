// =============================================================
// src/components/common/Toggle.tsx
// 역할: 공통 토글 스위치 컴포넌트
// 주요 기능: label과 함께 boolean 값 on/off 처리
// =============================================================

import React from 'react';
import styles from './Toggle.module.scss';

interface ToggleProps {
  id?: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  id,
  label,
  checked,
  onChange,
  description,
}) => {
  const toggleId = id ?? `toggle-${Math.random().toString(36).slice(2)}`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <div className={styles.textGroup}>
          <label htmlFor={toggleId} className={styles.label}>
            {label}
          </label>
          {description && (
            <span className={styles.description}>{description}</span>
          )}
        </div>
        <button
          id={toggleId}
          type="button"
          role="switch"
          aria-checked={checked}
          className={[styles.switch, checked ? styles.on : ''].join(' ')}
          onClick={() => onChange(!checked)}
        >
          <span className={styles.thumb} />
        </button>
      </div>
    </div>
  );
};

export default Toggle;
