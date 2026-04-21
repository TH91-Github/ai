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
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/** 다음달까지 가능하게 **/
export const getMaxNextMonthString = () => {
  const today = new Date();

  // 다음 달로 이동
  const nextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  );

  // YYYY-MM-DD 포맷 맞추기
  const yyyy = nextMonth.getFullYear();
  const mm = String(nextMonth.getMonth() + 1).padStart(2, "0");
  const dd = String(nextMonth.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
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
  배경색 #fff, 최대 너비 800px, 줄간격 1.8, 여백 충분히, 모바일 대응(반응형) 포함.
  제목 영역과 본문 영역에는 그라데이션, 컬러 배경, 카드 배경을 넣지 말고 흰 배경 또는 투명 배경으로 단순하게 유지해 주세요.
  블로그 에디터에 그대로 옮겨도 배경색이 붙지 않도록 배경 스타일은 최소화해 주세요.`
    : '';

  // 이미지 프롬프트: 전체 글 흐름상 최대 3개
  const imageGuide = includeImage
    ? `\n- 글 전체 흐름에서 시각적으로 꼭 필요한 위치에만 이미지 프롬프트를 배치해 주세요.
  이미지 수는 썸네일 1개를 제외하고 본문 안에서는 최대 2개까지만 사용해 주세요.
  위치 기준: ① 도입부 대표 이미지, ② 핵심 본문 1곳, ③ 필요할 때만 본문 추가 1곳
  형식: [Image prompt: 영문 설명, photographic style, natural lighting]
  각 항목마다 무조건 넣지 말고, 이야기 흐름상 자연스러운 곳에만 삽입해 주세요.`
    : '';

  const title = generateTitle(subTopic || mainTopic, tone);

  const prompt = `
당신은 전문 블로그 작가입니다. 아래 조건에 맞는 블로그 글을 작성해 주세요.

[주제 설정 — AI 자율 선택]
- 메인 주제: ${mainTopic}
- 세부 주제 선정: ${subTopicHint}
→ 위 힌트를 참고하여 AI가 가장 독자에게 유익하고 흥미로운 세부 주제와 제목을 직접 결정해 주세요.
→ 제목을 직접 결정하면서 어떤 사건, 일인지 알 수 있게도 작성해 주세요.
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
- 제목에는 주제와 어울리는 이모지를 1개 정도 자연스럽게 사용할 수 있습니다.
- 소제목에도 흐름을 돕는 이모지를 가볍게 사용할 수 있지만, 남발하지 말아 주세요.
- 이미지가 필요하다면 AI 일러스트 느낌보다 실제 기사 사진이나 현장 사진처럼 보이는 실사형 프롬프트를 우선해 주세요.
- 이미지 프롬프트 안에 ChatGPT, GPT, OpenAI 같은 도구명이나 브랜드명이 이미지 요소로 들어가도록 요청하지 말아 주세요.
- 이미지 안에 생성 도구 이름, 워터마크, 불필요한 텍스트가 보이지 않도록 해 주세요.
- 본문 이미지 2개가 모두 비슷한 장면이 되지 않도록, 구도·거리감·장면 초점·배경 요소를 서로 다르게 작성해 주세요.
- 예를 들어 하나는 전체 상황을 보여주는 넓은 장면, 다른 하나는 핵심 대상을 더 가까이 보여주는 장면처럼 차이를 두어 주세요.
- 전체적으로 과장된 연출, 과한 조명, 과도한 영화 포스터 느낌보다 차분하고 현실적인 사진 분위기를 우선해 주세요.
`.trim();

  return { title, prompt, subTopic: subTopic || mainTopic, keywords, includeHtml };
};

// ── 오늘의 역사형 프롬프트 생성 ──────────────────────────────
export const generateHistoryPrompt = (
  form: HistoryDraftForm,
  usedHistoryTopics: string[] = []
): GeneratedPrompt => {
  const { date, koreaFirst, tone, includeImage } = form;

  if (!date) {
    throw new Error('날짜는 필수입니다.');
  }

  const [, month, day] = date.split('-');
  const subTopic = `${month}월 ${day}일의 역사`;
  const title = `${month}월 ${day}일, 오늘의 역사`;
  const keywords = ['오늘의역사', `${month}월${day}일`, '역사적사건', '한국사', '세계사'];

  const koreaGuide = koreaFirst
    ? '대한민국 사건을 우선해서 고르고, 이후 세계사적 사건을 자연스럽게 연결해 주세요.'
    : '대한민국 사건에만 치우치지 말고 세계사 사건도 함께 고르게 담아 주세요.';

  const toneGuide =
    tone === 'blog'
      ? '딱딱한 해설보다 역사 강연을 듣는 듯한 스토리텔링 문체로, 쉽고 집중되게 풀어 주세요.'
      : '쉽게 이해되는 설명형 문체를 유지하되, 너무 교과서처럼 딱딱하지 않게 작성해 주세요.';

  const imageGuide = includeImage
    ? `\n- 이미지 프롬프트는 썸네일 1개와 본문 최대 2개까지만 넣어 주세요.
  위치 기준: 도입부 상단 1개, 가장 인상적인 장면 1개, 필요할 때만 마무리 대표 이미지 1개
  형식은 반드시 [Image prompt: 영어 설명, historical photo style, cinematic lighting] 로 맞춰 주세요.
  중간중간 이미지를 많이 넣지 말고, 이야기 흐름상 꼭 필요한 장면에만 배치해 주세요.`
    : '';

  const formattedDate = date.split('-').join('.');
  const excludeGuide =
    usedHistoryTopics.length > 0
      ? `\n- 이미 등록된 역사 주제나 비슷한 내용은 제외하고 다른 사건을 골라 주세요.
- 제외 대상 참고: ${usedHistoryTopics.slice(0, 12).join(' / ')}`
      : '';

  const prompt = `
당신은 역사 강연가 스타일의 스토리텔링 작가입니다.
딱딱한 설명이 아니라, 마치 방송에서 이야기하듯 몰입감 있게 풀어 주세요.
중요하게, 지금 필요한 것은 설명문이나 코드 조각이 아니라 사용자가 바로 열어볼 수 있는 완성형 HTML 결과물입니다.
가능하다면 채팅창의 코드 설명 대신 다운로드 가능한 .html 파일, HTML 아티팩트, Canvas 결과물 형태로 제공해 주세요.
파일 제공이 불가능한 환경이라면 그때만 완성된 HTML 전체 코드를 처음부터 끝까지 생략 없이 출력해 주세요.

입력 정보
- 날짜: ${formattedDate}
- 톤: ${tone === 'blog' ? '스토리텔링 (몰입형)' : '설명형 (쉽고 차분한 톤)'}
- 대한민국 사건 우선 여부: ${koreaFirst ? 'true' : 'false'}

작성 조건
1. 결과물 형식
- 결과는 반드시 완성형 HTML로 작성해 주세요.
- <!DOCTYPE html> 부터 </html> 까지 전체 구조를 포함해 주세요.
- CSS는 HTML 내부 style 태그에 포함해 주세요.
- 코드블록 마크다운, 설명문, 해설, "아래는 코드입니다" 같은 문구는 금지합니다.
- 제목 영역과 본문 영역에는 그라데이션, 컬러 배경, 카드형 배경을 넣지 말고 흰 배경 또는 투명 배경으로 단순하게 구성해 주세요.
- 블로그 글쓰기 에디터에 붙여넣었을 때 배경색이 따라 들어가지 않도록 배경 스타일은 최대한 쓰지 말아 주세요.

2. 진행 방식
- 바로 HTML 본문을 쓰기 전에 먼저 오늘 날짜에 해당하는 역사 사건 후보 3~5개를 짧게 보여 주세요.
- 각 후보는 연도 + 사건명 + 한 줄 설명 정도로만 간단히 정리해 주세요.
- 그리고 마지막에 "이 중 어떤 사건으로 깊게 작성할까요?"라고 한 번 질문해 주세요.
- 사용자가 하나를 선택하면 그때 선택된 사건만 기준으로 완성형 HTML 결과물을 작성해 주세요.
- 처음 질문 단계에서는 HTML 전체를 만들지 말고, 사건 후보를 보여주고 선택을 기다려 주세요.

3. 사용자가 사건을 고른 뒤의 전체 구조와 순서
- 상단 대표 썸네일 시작
- 도입부
- 선택된 사건 1개를 중심으로 깊이 있는 본문
- 본문 흐름 속 이미지 포함
- 가장 하단에 고정 타이틀 "핵심 요약"
- 핵심 요약은 리스트 형태로 3~5개 정리
- 가장 마지막에는 소제목을 또 만들기보다, 본문을 자연스럽게 닫아주는 짧은 마무리 멘트로 끝내 주세요.
- 가장 하단에는 해시태그를 여러 개 정리해 주세요.
- 마지막에는 사용자가 전달하는 푸른 도깨비 이미지를 바탕으로 한 마무리 대표 이미지 프롬프트를 함께 제안할 수 있습니다.
- 이 마무리 대표 이미지는 본문 중간 이미지와 겹치지 않게, 글 전체 내용을 상징적으로 보여주는 장면이어야 합니다.

4. 톤과 스타일
- ${toneGuide}
- 말하듯 자연스럽게 작성해 주세요.
- 불필요한 설명을 길게 늘이지 말고 핵심만 또렷하게 정리해 주세요.
- 중간중간 장면과 분위기가 그려질 정도의 상황 묘사는 넣되, 과장되거나 추측성 표현은 넣지 말아 주세요.
- "그때 상황을 떠올려보면"처럼 자연스럽게 몰입을 유도하는 흐름은 사용할 수 있습니다.

5. 사건 구성 방식
선정한 메인 사건은 아래 흐름으로 풀어 주세요.
- 첫 장면이나 당시 분위기로 시작
- 사건이 벌어진 배경을 짧게 설명
- 실제 전개 과정을 자연스럽게 이어서 소개
- 결과와 이후 흐름까지 연결
- "왜 중요한지" 같은 메타 설명 소제목은 따로 만들지 말고, 본문 안에 자연스럽게 녹여 주세요.

6. 분량
- 전체 1,000 ~ 1,300자
- 하나의 메인 사건을 중심으로 충분히 설명하되, 너무 늘어지지는 않게 정리해 주세요.${imageGuide}

7. 금지 사항
- 논문처럼 딱딱하게 설명하지 말 것
- "~이다." 문장만 반복하지 말 것
- 과한 감정 연출 금지
- 사실이 불확실한 내용, 추측, 과장 금지
- 이미지가 필요할 때도 AI 일러스트나 포스터처럼 보이는 장면은 피하고, 실제 기록 사진이나 다큐멘터리 장면처럼 보이는 실사형 분위기를 우선해 주세요.
- 이미지 프롬프트 안에 ChatGPT, GPT, OpenAI 같은 생성 도구 이름이나 워터마크가 이미지에 나타나도록 요청하지 말아 주세요.
- 과한 연출, 지나치게 극적인 영화 포스터 톤, 부자연스러운 얼굴 표현은 피하고 차분한 실사 사진 느낌을 우선해 주세요.

출력 형식
- 첫 단계 답변에서는 사건 후보 목록과 선택 질문만 보여 주세요.
- 사용자가 사건을 고른 다음 단계에서만 HTML 결과물을 작성해 주세요.
- HTML title과 화면 상단 h1 모두 새로 다듬은 제목을 사용해 주세요.
- 제목은 입력 날짜를 바탕으로 자연스럽게 다시 뽑아 주세요.
- 화면에 보이는 상단 제목(h1)에는 주제와 어울리는 이모지를 1개 정도 자연스럽게 포함해 주세요.
- 상단 썸네일 아래에서 바로 도입부가 이어지게 해 주세요.
- 본문은 한 사건을 중심으로 이어지는 이야기처럼 흘러가게 해 주세요.
- 사건 사이를 나누는 설명보다 하나의 이야기처럼 읽히는 구성을 우선해 주세요.
- 소제목에도 흐름을 돕는 이모지를 가볍게 사용할 수 있습니다.
- 본문 이미지가 2개 들어간다면 서로 비슷한 장면으로 반복하지 말고, 하나는 시대 분위기나 공간 중심, 다른 하나는 사건 핵심 인물이나 상징 장면 중심처럼 차이를 분명히 두어 주세요.
- 마지막 대표 이미지를 제안할 때는 사용자가 전달하는 푸른 도깨비 레퍼런스 이미지를 기준으로, 도깨비의 표정·행동·시선이 오늘 본문 내용과 어울리게 작성해 주세요.
- 이 마지막 대표 이미지는 본문 장면을 단순 반복하지 말고, 글 전체를 대표하는 마무리 컷처럼 보여야 합니다.
- 필요한 경우 형식은 [마무리 도깨비 이미지 프롬프트: ...] 로 따로 구분해 주세요.
- 가장 하단 요약 섹션의 타이틀은 반드시 "핵심 요약"으로 고정해 주세요.
- 마지막 마무리 문장은 별도 소제목 없이, 오늘 이야기를 조용히 정리해 주는 한두 문장으로 마감해 주세요.
- 글의 맨 아래에는 #오늘의역사 형태의 해시태그를 6~10개 정도 한 줄 또는 두 줄로 자연스럽게 정리해 주세요.

추가 기준
- ${koreaGuide}
- 사건은 반드시 사실 기반으로만 정리해 주세요.
- 연도는 자연스럽게 드러나야 하고, 역사 입문자도 쉽게 이해할 수 있어야 합니다.
- 결과물은 내가 다른 AI에게 전달해서 HTML 완성본이나 다운로드 가능한 HTML 파일 형태로 받기 위한 요청문이므로, 그 의도가 흔들리지 않게 유지해 주세요.${excludeGuide}
- html 파일로 다운로드할 수 있게 다시 한번.
`.trim();

  return { title, prompt, subTopic, keywords, includeHtml: false };
};
