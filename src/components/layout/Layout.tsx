// =============================================================
// src/components/layout/Layout.tsx
// 역할: 전체 레이아웃 (헤더 + 네비게이션 + 콘텐츠 영역)
// 주요 기능: 상단 GNB 메뉴 탭 네비게이션, Outlet으로 페이지 렌더링
// =============================================================

import React from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Layout.module.scss';

const PRIMARY_NAV_ITEMS = [
  { key: 'blog', to: '/blog/draft', label: '📝 블로그' },
  { key: 'song', to: '/song/draft', label: '🎵 노래' },
  { key: 'video', to: '/video/draft', label: '🎬 영상' },
] as const;

const SECONDARY_NAV_ITEMS = {
  blog: [
    { to: '/blog/draft', label: '초안 만들기' },
    { to: '/blog/registry', label: '등록 목록' },
  ],
  song: [
    { to: '/song/draft', label: '초안 만들기' },
    { to: '/song/registry', label: '등록 목록' },
  ],
  video: [
    { to: '/video/draft', label: '초안 만들기' },
    { to: '/video/registry', label: '등록 목록' },
  ],
} as const;

const Layout: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const activeSection = PRIMARY_NAV_ITEMS.find((item) => location.pathname.startsWith(`/${item.key}`))?.key ?? 'blog';

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.brand}>
            <span className={styles.brandIcon}>🖊</span>
            <span className={styles.brandName}>BlogPrompt<em>Tool</em></span>
          </Link>
          <nav className={styles.primaryNav} aria-label="대분류 메뉴">
            {PRIMARY_NAV_ITEMS.map(({ key, to, label }) => (
              <NavLink
                key={key}
                to={to}
                className={({ isActive }) =>
                  [styles.navItem, isActive || location.pathname.startsWith(`/${key}`) ? styles.navItemActive : ''].join(' ')
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className={styles.authArea}>
            {loading ? (
              <span className={styles.authMuted}>확인 중</span>
            ) : user ? (
              <>
                <span className={styles.userEmail}>{user.email}</span>
                <button type="button" className={styles.authButton} onClick={logout}>
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    [styles.authLink, isActive ? styles.authLinkActive : ''].join(' ')
                  }
                >
                  로그인
                </NavLink>
              </>
            )}
          </div>
        </div>
        <div className={styles.subnavWrap}>
          <div className={styles.subnavInner}>
            <nav className={styles.secondaryNav} aria-label="세부 메뉴">
              {SECONDARY_NAV_ITEMS[activeSection].map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    [styles.subnavItem, isActive ? styles.subnavItemActive : ''].join(' ')
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
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
