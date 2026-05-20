// =============================================================
// src/pages/StatsPage.tsx
// 역할: 종합 통계 페이지
// 주요 기능:
//   - 총 등록 글 수
//   - 주제별 / 타입별 개수
//   - 최근 등록 글
//   - 키워드 빈도 상위 20개
// =============================================================

import React, { useEffect, useMemo } from 'react';
import Badge from '@/components/common/Badge';
import { useRegistryStore } from '@/store/useRegistryStore';
import { calcStats } from '@/utils/statsHelper';
import styles from './StatsPage.module.scss';

const StatsPage: React.FC = () => {
  const { items, loading, fetchItems } = useRegistryStore();
  const stats = useMemo(() => calcStats(items), [items]);

  useEffect(() => {
    fetchItems('all', true).catch(() => {
      // 빈 화면 대신 기존 상태를 유지합니다.
    });
  }, [fetchItems]);

  if (loading && items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>종합 통계</h1>
        </div>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>⏳</span>
          <p>통계를 불러오는 중입니다.</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>종합 통계</h1>
        </div>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📊</span>
          <p>아직 등록된 항목이 없습니다.<br />초안 만들기에서 글을 등록하면 통계가 표시됩니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>종합 통계</h1>
        <p className={styles.pageDesc}>블로그와 노래 등록 현황을 간단히 확인합니다</p>
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryIcon}>📚</span>
          <div>
            <p className={styles.summaryLabel}>블로그</p>
            <p className={styles.summaryValue}>{stats.blogCount}<span>개</span></p>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryIcon}>🎵</span>
          <div>
            <p className={styles.summaryLabel}>노래</p>
            <p className={styles.summaryValue}>{stats.songCount}<span>개</span></p>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🕐 최근 등록 글</h2>
          <Badge color="primary">{stats.recentItems.length}개</Badge>
        </div>
        <ul className={styles.recentList}>
          {stats.recentItems.map((item) => (
            <li key={item.id} className={styles.recentItem}>
              <div className={styles.recentMeta}>
                <Badge color="neutral">{item.mainTopic}</Badge>
                <span className={styles.recentDate}>
                  {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <p className={styles.recentTitle}>
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default StatsPage;
