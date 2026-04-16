// =============================================================
// src/pages/StatsPage.tsx
// 역할: 종합 통계 페이지
// 주요 기능:
//   - 총 등록 글 수
//   - 주제별 / 타입별 개수
//   - 최근 등록 글
//   - 키워드 빈도 상위 20개
// =============================================================

import React, { useMemo } from 'react';
import Badge from '@/components/common/Badge';
import { useRegistryStore } from '@/store/useRegistryStore';
import { calcStats } from '@/utils/statsHelper';
import styles from './StatsPage.module.scss';

const TYPE_LABELS: Record<string, string> = {
  general: '일반 주제형',
  history: '오늘의 역사형',
};

const StatsPage: React.FC = () => {
  const { items } = useRegistryStore();
  const stats = useMemo(() => calcStats(items), [items]);

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
        <p className={styles.pageDesc}>등록된 블로그 글의 현황을 한눈에 확인합니다</p>
      </div>

      {/* 요약 카드 */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryIcon}>📝</span>
          <div>
            <p className={styles.summaryLabel}>총 등록 글</p>
            <p className={styles.summaryValue}>{stats.totalCount}<span>개</span></p>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryIcon}>🗂</span>
          <div>
            <p className={styles.summaryLabel}>주제 카테고리</p>
            <p className={styles.summaryValue}>{Object.keys(stats.byTopic).length}<span>개</span></p>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryIcon}>🏷</span>
          <div>
            <p className={styles.summaryLabel}>누적 키워드</p>
            <p className={styles.summaryValue}>{stats.keywordFrequency.length}<span>개</span></p>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {/* 주제별 통계 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>📂 주제별 등록 현황</h2>
          <div className={styles.barList}>
            {Object.entries(stats.byTopic)
              .sort(([, a], [, b]) => b - a)
              .map(([topic, count]) => (
                <div key={topic} className={styles.barItem}>
                  <span className={styles.barLabel}>{topic}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{
                        width: `${(count / stats.totalCount) * 100}%`,
                      }}
                    />
                  </div>
                  <span className={styles.barCount}>{count}</span>
                </div>
              ))}
          </div>
        </section>

        {/* 타입별 통계 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🏷 타입별 현황</h2>
          <div className={styles.typeList}>
            {Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} className={styles.typeItem}>
                <span>{TYPE_LABELS[type] ?? type}</span>
                <Badge color="primary">{count}개</Badge>
              </div>
            ))}
          </div>
        </section>

        {/* 최근 등록 글 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🕐 최근 등록 글</h2>
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

        {/* 키워드 빈도 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🔑 키워드 빈도 TOP 20</h2>
          <div className={styles.keywordCloud}>
            {stats.keywordFrequency.map(({ keyword, count }) => (
              <span
                key={keyword}
                className={styles.keywordItem}
                style={{
                  fontSize: `${0.75 + (count / stats.keywordFrequency[0].count) * 0.6}rem`,
                  opacity: 0.5 + (count / stats.keywordFrequency[0].count) * 0.5,
                }}
              >
                {keyword}
                <sup className={styles.keywordCount}>{count}</sup>
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StatsPage;
