// =============================================================
// src/utils/duplicateCheck.ts
// 역할: 등록 목록과의 중복 여부를 판단하는 유틸리티
// 기준: subTopic 유사도 / title 포함 관계 / 핵심 키워드 2개 이상 겹침
// 주의: normalize 처리 후 비교 (공백 제거, 소문자, 특수문자 제거)
// =============================================================

import type { RegistryItem, DuplicateCheckResult } from '@/types';

/**
 * 문자열 정규화: 공백 제거, 소문자 변환, 특수문자 제거
 */
export const normalize = (str: string): string =>
  str
    .toLowerCase()
    .replace(/[\s\u00AD\u200B]+/g, '') // 공백 및 숨김 문자 제거
    .replace(/[^\p{L}\p{N}]/gu, '');   // 특수문자 제거 (유니코드 지원)

/**
 * 두 문자열 간 유사도 계산 (간단한 공통 n-gram 기반)
 * @returns 0 ~ 1 사이의 유사도 점수
 */
export const calcSimilarity = (a: string, b: string): number => {
  const na = normalize(a);
  const nb = normalize(b);

  if (!na || !nb) return 0;
  if (na === nb) return 1;

  const longer = na.length > nb.length ? na : nb;
  const shorter = na.length > nb.length ? nb : na;

  if (longer.includes(shorter)) return 0.9;

  // bigram overlap
  const getBigrams = (s: string): Set<string> => {
    const set = new Set<string>();
    for (let i = 0; i < s.length - 1; i++) {
      set.add(s.slice(i, i + 2));
    }
    return set;
  };

  const biA = getBigrams(na);
  const biB = getBigrams(nb);
  const intersection = [...biA].filter((b) => biB.has(b)).length;
  const union = new Set([...biA, ...biB]).size;

  return union === 0 ? 0 : intersection / union;
};

/**
 * 중복 여부 검사
 * @param subTopic  - 생성 예정 세부 주제
 * @param title     - 생성 예정 제목
 * @param keywords  - 생성 예정 키워드 목록
 * @param registry  - 기존 등록 목록
 */
export const checkDuplicate = (
  subTopic: string,
  title: string,
  keywords: string[],
  registry: RegistryItem[]
): DuplicateCheckResult => {
  for (const item of registry) {
    // 1. subTopic 유사도 0.75 이상 → 중복
    const topicSim = calcSimilarity(subTopic, item.subTopic);
    if (topicSim >= 0.75) {
      return {
        isDuplicate: true,
        reason: `세부 주제 유사도가 높습니다 (${Math.round(topicSim * 100)}%)`,
        matchedItem: item,
      };
    }

    // 2. title 포함 관계 → 중복
    const nTitle = normalize(title);
    const nItemTitle = normalize(item.title);
    if (
      nTitle.length > 0 &&
      nItemTitle.length > 0 &&
      (nTitle.includes(nItemTitle) || nItemTitle.includes(nTitle))
    ) {
      return {
        isDuplicate: true,
        reason: '제목이 기존 항목과 포함 관계에 있습니다',
        matchedItem: item,
      };
    }

    // 3. 핵심 키워드 2개 이상 겹침 → 중복
    const normalizedKeywords = keywords.map(normalize);
    const normalizedItemKeywords = item.keywords.map(normalize);
    const overlap = normalizedKeywords.filter((k) =>
      normalizedItemKeywords.includes(k)
    );
    if (overlap.length >= 2) {
      return {
        isDuplicate: true,
        reason: `키워드 ${overlap.join(', ')} 등이 기존 항목과 겹칩니다`,
        matchedItem: item,
      };
    }
  }

  return { isDuplicate: false };
};
