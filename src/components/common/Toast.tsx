// =============================================================
// src/components/common/Toast.tsx
// 역할: 상단 알림 토스트 컴포넌트
// 주요 기능: success / error / warning / info 타입 지원, 자동 소멸
// =============================================================

import React, { useEffect } from 'react';
import styles from './Toast.module.scss';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number; // ms
  onClose: () => void;
}

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={[styles.toast, styles[`toast--${type}`]].join(' ')} role="alert">
      <span className={styles.icon}>{ICONS[type]}</span>
      <span className={styles.message}>{message}</span>
      <button className={styles.close} onClick={onClose} aria-label="닫기">
        ✕
      </button>
    </div>
  );
};

export default Toast;
