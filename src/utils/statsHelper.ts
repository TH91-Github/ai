// =============================================================
// src/utils/statsHelper.ts
// 역할: 등록 목록 데이터를 기반으로 통계 데이터 계산
// =============================================================

import type { RegistryItem, StatsData } from '@/types';

export const calcStats = (registry: RegistryItem[]): StatsData => {
  const byTopic: Record<string, number> = {};
  const byType = { general: 0, history: 0, song: 0, video: 0 };
  const keywordMap: Record<string, number> = {};

  for (const item of registry) {
    // 주제별
    byTopic[item.mainTopic] = (byTopic[item.mainTopic] ?? 0) + 1;
    // 타입별
    byType[item.type] = (byType[item.type] ?? 0) + 1;
    // 키워드 빈도
    for (const kw of item.keywords) {
      keywordMap[kw] = (keywordMap[kw] ?? 0) + 1;
    }
  }

  const keywordFrequency = Object.entries(keywordMap)
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const recentItems = [...registry]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return {
    totalCount: registry.length,
    byTopic,
    byType,
    recentItems,
    keywordFrequency,
  };
};
