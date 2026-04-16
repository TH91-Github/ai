// =============================================================
// src/components/common/Badge.tsx
// 역할: 키워드, 타입 표시용 배지 컴포넌트
// =============================================================

import React from 'react';
import styles from './Badge.module.scss';

type BadgeColor = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
}

const Badge: React.FC<BadgeProps> = ({ children, color = 'neutral' }) => (
  <span className={[styles.badge, styles[`badge--${color}`]].join(' ')}>
    {children}
  </span>
);

export default Badge;
