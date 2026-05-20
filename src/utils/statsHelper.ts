// =============================================================
// src/utils/statsHelper.ts
// 역할: 등록 목록 데이터를 기반으로 통계 데이터 계산
// =============================================================

import type { RegistryItem, StatsData } from '@/types';

export const calcStats = (registry: RegistryItem[]): StatsData => {
  const blogItems = registry.filter((item) => item.category === 'blog');
  const songItems = registry.filter((item) => item.category === 'song');

  const recentItems = [...blogItems]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return {
    totalCount: blogItems.length + songItems.length,
    blogCount: blogItems.length,
    songCount: songItems.length,
    recentItems,
  };
};
