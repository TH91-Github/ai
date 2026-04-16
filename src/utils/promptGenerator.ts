// =============================================================
// src/utils/promptGenerator.ts
// 역할: 입력 폼 데이터를 받아 한국어 AI 프롬프트를 생성
// 주의: 이 함수는 "AI에게 전달할 프롬프트"를 만드는 것이 목적
// =============================================================

import type {
  GeneralDraftForm,
  HistoryDraftForm,
  GeneratedPrompt,
  ToneType,
} from '@/types';
import { getSubTopics } from '@/data/topicPool';

/** 현재 날짜를 YYYY-MM-DD 형식으로 반환 */
export const getTodayString = (): string => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};

/** 랜덤 UUID (crypto.randomUUID 미지원 환경 폴백 포함) */
export const generateId = (): string => {
  try {
    return crypto.randomUUID();
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
};

/**
 * 세부 주제 자동 선택
 * - 등록 목록과 겹치지 않는 항목 중 랜덤 선택
 * - 모두 겹치면 첫 번째 항목 반환 (최소 1개 보장)
 */
export const pickSubTopic = (
  mainTopic: string,
  usedSubTopics: string[]
): string => {
  const pool = getSubTopics(mainTopic);
  if (pool.length === 0) return '';

  const available = pool.filter(
    (t) => !usedSubTopics.some((u) => u === t)
  );
  const candidates = available.length > 0 ? available : pool;

  return candidates[Math.floor(Math.random() * candidates.length)];
};

/** 제목 자동 생성 */
export const generateTitle = (
  subTopic: string,
  tone: ToneType
): string => {
  if (tone === 'blog') {
    const prefixes = [
      '알아두면 유익한',
      '꼭 알아야 할',
      '쉽게 이해하는',
      '실생활에서 바로 쓰는',
      '전문가가 알려주는',
    ];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    return `${prefix} ${subTopic}`;
  }
  // info 톤
  const prefixes = ['완벽 정리:', '핵심 가이드:', '정보 정리:', '한눈에 보는:'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  return `${prefix} ${subTopic}`;
};

/** 키워드 추출 (세부 주제 기반 간단 토크나이저) */
export const extractKeywords = (
  mainTopic: string,
  subTopic: string
): string[] => {
  const raw = `${mainTopic} ${subTopic}`;
  // 2글자 이상 단어만 추출, 중복 제거
  const tokens = raw
    .split(/[\s,·]+/)
    .map((t) => t.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter((t) => t.length >= 2);

  return [...new Set(tokens)].slice(0, 6);
};

// ── 일반 주제형 프롬프트 생성 ─────────────────────────────────
export const generateGeneralPrompt = (
  form: GeneralDraftForm
): GeneratedPrompt => {
  const { mainTopic, subTopic, tone, includeHtml, includeImage } = form;

  if (!mainTopic) {
    throw new Error('메인 주제는 필수입니다.');
  }

  // 세부 주제 힌트 풀 구성 (AI가 참고 후 자율 선택)
  const subTopicPool = getSubTopics(mainTopic);
  const subTopicHint = subTopic
    ? `아래 참고 힌트 중 하나를 선택하거나, 더 적합한 세부 주제를 자유롭게 선정해도 됩니다:\n  힌트 예시: ${subTopicPool.slice(0, 5).join(' / ')}\n  (현재 선호 힌트: "${subTopic}" — 비슷하거나 더 나은 주제로 자유롭게 변경 가능)`
    : `아래 힌트를 참고하여 가장 흥미롭고 독자에게 유익한 세부 주제를 AI가 직접 선정해 주세요:\n  힌트 예시: ${subTopicPool.slice(0, 5).join(' / ')}`;

  const keywords = extractKeywords(mainTopic, subTopic || mainTopic);

  const toneGuide =
    tone === 'blog'
      ? '친근하고 읽기 쉬운 블로그 문체로, 독자와 대화하듯 작성해 주세요.'
      : '신뢰감 있는 정보 전달 문체로, 객관적이고 명확하게 작성해 주세요.';

  // HTML 출력 시 완전한 HTML 파일 구조 요구
  const htmlGuide = includeHtml
    ? `\n- 결과물은 반드시 완전한 HTML 파일 형식으로 작성해 주세요.
  <!DOCTYPE html>부터 </html>까지 전체 구조를 포함하고,
  <head>에 charset, viewport, 인라인 <style>로 가독성 좋은 CSS를 포함해 주세요.
  본문은 <h1>(제목), <h2>(소제목), <p>, <ul>, <strong> 등을 적절히 사용해 주세요.
  배경색 #fff, 최대 너비 800px, 줄간격 1.8, 여백 충분히, 모바일 대응(반응형) 포함.`
    : '';

  // 이미지 프롬프트: 전체 글 흐름상 최대 3개
  const imageGuide = includeImage
    ? `\n- 글 전체 흐름에서 시각적으로 꼭 필요한 위치 최대 3곳에만 이미지 프롬프트를 배치해 주세요.
  위치 기준: ① 도입부 대표 이미지, ② 핵심 본문 1곳, ③ 마무리 직전 1곳(선택)
  형식: [Image prompt: 영문 설명, photographic style, natural lighting]
  각 항목마다 무조건 넣지 말고, 글 흐름상 자연스러운 곳에만 삽입해 주세요.`
    : '';

  const title = generateTitle(subTopic || mainTopic, tone);

  const prompt = `
당신은 전문 블로그 작가입니다. 아래 조건에 맞는 블로그 글을 작성해 주세요.

[주제 설정 — AI 자율 선택]
- 메인 주제: ${mainTopic}
- 세부 주제 선정: ${subTopicHint}
→ 위 힌트를 참고하여 AI가 가장 독자에게 유익하고 흥미로운 세부 주제와 제목을 직접 결정해 주세요.
→ 결과물 첫 줄에 "선정된 세부 주제: ___" 형식으로 명시해 주세요.

[작성 조건]
- 톤앤매너: ${toneGuide}
- 분량: 1,200 ~ 1,800자 (한국어 기준)
- 구성: 도입부 → 본문 (3~4개 소제목) → 마무리
- 참고 키워드(자연스럽게 활용): ${keywords.join(', ')}
- 사실에 근거하여 작성하고, 과장된 표현은 지양해 주세요.${htmlGuide}${imageGuide}

[추가 지침]
- SEO를 고려하여 키워드를 자연스럽게 배치해 주세요.
- 독자가 실생활에서 바로 적용할 수 있는 실용적인 정보를 포함해 주세요.
- 소제목은 독자의 궁금증을 유발하는 형태로 작성해 주세요.
`.trim();

  return { title, prompt, subTopic: subTopic || mainTopic, keywords, includeHtml };
};

// ── 오늘의 역사형 프롬프트 생성 ──────────────────────────────
export const generateHistoryPrompt = (
  form: HistoryDraftForm
): GeneratedPrompt => {
  const { date, koreaFirst, tone, includeImage } = form;

  if (!date) {
    throw new Error('날짜는 필수입니다.');
  }

  const [, month, day] = date.split('-');
  const subTopic = `${month}월 ${day}일의 역사`;
  const title = `오늘의 역사: ${month}월 ${day}일에 있었던 주요 사건들`;
  const keywords = ['오늘의역사', `${month}월${day}일`, '역사적사건', '한국사', '세계사'];

  const koreaGuide = koreaFirst
    ? '대한민국 주요 사건을 우선적으로 다루고, 이후 세계사적 사건을 다루어 주세요.'
    : '세계사적 사건과 대한민국 사건을 균형 있게 다루어 주세요.';

  const toneGuide =
    tone === 'info'
      ? '역사적 사실을 기반으로 객관적이고 교육적인 문체로 작성해 주세요.'
      : '독자가 흥미를 느낄 수 있도록 스토리텔링 방식의 블로그 문체로 작성해 주세요.';

  const imageGuide = includeImage
    ? `\n- 글 전체 흐름에서 꼭 필요한 위치 최대 3곳에만 이미지 프롬프트를 배치해 주세요.
  위치 기준: ① 도입부 대표 이미지, ② 가장 인상적인 사건 1곳, ③ 마무리 직전(선택)
  형식: [Image prompt: 영문 설명, historical photo style, dramatic lighting]
  사건마다 무조건 삽입하지 말고, 글 흐름상 자연스러운 곳에만 넣어 주세요.`
    : '';

  const prompt = `
당신은 역사 전문 블로그 작가입니다. 오늘 날짜(${month}월 ${day}일)를 기준으로 과거에 일어났던 주요 역사적 사건들을 정리한 블로그 글을 작성해 주세요.

[작성 조건]
- 국가 우선순위: ${koreaGuide}
- 톤앤매너: ${toneGuide}
- 분량: 1,000 ~ 1,500자 (한국어 기준)
- 사건 수: 3~5개 (연도 포함, 연도순 정렬)
- 구성: 도입부 → 사건별 소개 → 오늘의 의미 마무리${imageGuide}

[필수 지침]
- 반드시 사실에 근거하여 작성하고, 추측이나 과장은 절대 포함하지 마세요.
- 각 사건에는 연도를 명확히 표기해 주세요. (예: 1945년 - 사건 내용)
- 독자가 역사적 맥락을 쉽게 이해할 수 있도록 간단한 배경 설명을 포함해 주세요.
- 사건의 역사적 의미나 현재까지의 영향을 한 줄로 요약해 주세요.
`.trim();

  return { title, prompt, subTopic, keywords, includeHtml: false };
};