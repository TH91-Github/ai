// =============================================================
// src/components/layout/Layout.tsx
// 역할: 전체 레이아웃 (헤더 + 네비게이션 + 콘텐츠 영역)
// 주요 기능: 상단 GNB 메뉴 탭 네비게이션, Outlet으로 페이지 렌더링
// =============================================================

import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import styles from './Layout.module.scss';

const NAV_ITEMS = [
  { to: '/',         label: '✏️ 초안 만들기' },
  { to: '/registry', label: '📚 등록 목록' },
  { to: '/stats',    label: '📊 종합 통계' },
  { to: '/temp',     label: '🧪 임시' },
];

const Layout: React.FC = () => {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.brand}>
            <span className={styles.brandIcon}>🖊</span>
            <span className={styles.brandName}>BlogPrompt<em>Tool</em></span>
          </Link>
          <nav className={styles.nav} aria-label="주 메뉴">
            {NAV_ITEMS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [styles.navItem, isActive ? styles.navItemActive : ''].join(' ')
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          <Outlet />
        </div>
      </main>

      <footer className={styles.footer}>
        <span>BlogPrompt Tool &copy; {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
};

export default Layout;
