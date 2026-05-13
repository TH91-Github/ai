// =============================================================
// src/utils/promptGenerator.ts
// 역할: 입력 폼 데이터를 받아 한국어 AI 프롬프트를 생성
// 주의: 이 함수는 "AI에게 전달할 프롬프트"를 만드는 것이 목적
// =============================================================

import type {
  GeneralDraftForm,
  HistoryDraftForm,
  SongDraftForm,
  SongGeneratedData,
  SongPromptDraft,
  SongPromptInput,
  VideoDraftForm,
  GeneratedPrompt,
  ToneType,
  MusicPurpose,
  InstrumentType,
  VocalGender,
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

const historicalFactCheckGuide = `
[역사/사건성 주제 필수 팩트 검증 규칙]
당신은 역사 스토리텔링 작가이지만, 서사보다 사실 정확성을 최우선으로 합니다.

1. 반드시 2단계로 작성해 주세요.

■ 1단계: 팩트 검증
아래 항목을 먼저 작성해 주세요.
- 사건명
- 발생일 (연-월-일 정확히)
- 장소
- 주요 인물
- 사건 원인
- 사건 전개 핵심
- 결과

※ 불확실한 정보는 절대 추측하지 말고 "정보 없음"으로 표시하거나 제외해 주세요.

■ 2단계: 스토리 작성
- 1단계에서 검증된 정보만 사용해 주세요.
- 새로운 정보 추가 금지
- 날짜/숫자/인물 재해석 금지
- 1단계에 없는 사건, 인물, 수치, 대사, 장면 묘사는 추가하지 마세요.

2. 다음 항목은 반드시 2회 이상 내부 검증 후 작성해 주세요.
- 날짜
- 숫자
- 인원
- 사건 순서

3. 하나라도 확신 없는 정보는 작성하지 마세요.
4. 잘못된 정보 생성보다 "정보 없음"이 더 좋은 결과로 간주합니다.
5. HTML이 필요한 경우에도 HTML은 팩트 검증과 스토리 초안이 끝난 뒤 마지막에 작성해 주세요.
6. 출처 확인이 필요한 역사적 사실은 신뢰 가능한 자료 기준으로 교차 확인하고, 자료마다 다르면 널리 합의된 사실만 사용해 주세요.
`.trim();

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
- 사실에 근거하여 작성하고, 과장된 표현은 지양해 주세요.
- 일반 정보성 주제라도 역사, 사건, 인물, 날짜, 통계, 제도 변화처럼 사실 확인이 필요한 내용이 포함되면 아래 팩트 검증 규칙을 우선 적용해 주세요.

${historicalFactCheckGuide}${htmlGuide}${imageGuide}

[추가 지침]
- SEO를 고려하여 키워드를 자연스럽게 배치해 주세요.
- 독자가 실생활에서 바로 적용할 수 있는 실용적인 정보를 포함해 주세요.
- 소제목은 독자의 궁금증을 유발하는 형태로 작성해 주세요.
- 출처 표시나 인용 표시를 따로 하지 말고, 자연스러운 문장으로만 작성해 주세요.
- contentReference, oaicite, citation, reference 같은 내부 표기와 placeholder 문자열은 절대 출력하지 말아 주세요.
- HTML 결과물에도 사용자에게 실제로 보이는 텍스트만 포함하고, 코드/placeholder/참조 태그는 모두 제거해 주세요.
- 최종 출력은 사람이 바로 읽고 복사할 수 있는 순수 본문만 남겨 주세요.
- 메인 제목에는 주제와 어울리는 이모지를 1개 포함해 주세요.
- 각 소제목에도 내용과 분위기에 맞는 이모지를 1개씩 붙여, 타이틀끼리 시각적으로 구분되게 해 주세요.
- 다만 이모지가 과하게 튀지 않도록, 한 제목당 1개만 사용해 주세요.
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
      ? '딱딱한 해설보다 대중 역사 강연을 듣는 듯한 스토리텔링 문체로, 쉽고 생생하며 집중되게 풀어 주세요.'
      : '쉽게 이해되는 설명형 문체를 유지하되, 너무 교과서처럼 딱딱하지 않게 작성해 주세요.';

  const imageGuide = includeImage
    ? `\n- 이미지 프롬프트는 글 흐름상 꼭 필요할 때만 넣어 주세요.
  위치 기준: 도입부 대표 이미지 1개, 본문 중 가장 인상적인 장면 1개, 필요하면 추가 1개까지
  형식은 반드시 [Image prompt: 영어 설명] 로 맞춰 주세요.
  상단 대표 이미지와 본문 이미지는 documentary historical photo style, realistic environment, natural cinematic lighting 같은 실사형 기록 사진 분위기로 작성해 주세요.
  중간중간 이미지를 많이 넣지 말고, 이야기 흐름상 꼭 필요한 장면에만 배치해 주세요.
  굳이 시각 자료가 필요하지 않다면 이미지 프롬프트를 생략해도 됩니다.
  인물 장면을 만들 때는 인원이 과하게 많아 보이지 않게 하고, 자연스러운 거리감과 배치를 유지해 주세요.
  필요하면 한 인물의 뒤쪽이나 옆쪽 시점, 약간 흐린 전경, 조용한 긴장감 같은 다큐멘터리 사진 문법을 활용해 주세요.
  wide horizontal shot, cinematic composition, landscape orientation, wide frame, --ar 16:9 같은 가로형 구도를 자연스럽게 활용할 수 있습니다.
  no duplication, no overcrowding, no artificial crowd 같은 의도를 자연스럽게 반영해 주세요.`
    : '';

  const formattedDate = date.split('-').join('.');
  const excludeGuide =
    usedHistoryTopics.length > 0
      ? `\n- 이미 등록된 역사 주제나 비슷한 내용은 제외하고 다른 사건을 골라 주세요.
- 제외 대상 참고: ${usedHistoryTopics.slice(0, 12).join(' / ')}`
      : '';

  const prompt = `
당신은 단순 블로그 작성자가 아니라, 몰입형 역사 스토리텔링 작가입니다.
설명 위주의 딱딱한 글이 아니라, 독자가 처음 듣는 이야기처럼 빠져들게 만드는 글을 써 주세요.
이번 결과물은 느낌만 좋은 글이 아니라, 정보 밀도와 배경 설명, 사건 흐름, 이후 정리까지 살아 있는 완성도 높은 콘텐츠여야 합니다.
특정 실존 인물을 그대로 모사하지는 말고, 대중 역사 강연처럼 귀에 잘 들어오고 장면이 자연스럽게 떠오르는 구어체 리듬을 참고해 주세요.
중요하게, 지금 필요한 것은 설명문이나 코드 조각이 아니라 사용자가 바로 열어볼 수 있는 완성형 HTML 결과물입니다.
가능하다면 채팅창의 코드 설명 대신 다운로드 가능한 .html 파일, HTML 아티팩트, Canvas 결과물 형태로 제공해 주세요.
파일 제공이 불가능한 환경이라면 그때만 완성된 HTML 전체 코드를 처음부터 끝까지 생략 없이 출력해 주세요.
역사 정보는 반드시 사실 확인을 먼저 거친 뒤 작성해 주세요. 확인이 불충분한 내용은 추측해서 채우지 말고 제외해 주세요.

${historicalFactCheckGuide}

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
- 각 후보는 연도 + 사건명 + 한 줄 설명 정도로만 간단히 정리하되, 날짜와 사건명이 확실한 후보만 보여 주세요.
- 그리고 마지막에 "이 중 어떤 사건으로 깊게 작성할까요?"라고 한 번 질문해 주세요.
- 사용자가 하나를 선택하면 그때 선택된 사건만 기준으로 완성형 HTML 결과물을 작성해 주세요.
- 처음 질문 단계에서는 HTML 전체를 만들지 말고, 사건 후보를 보여주고 선택을 기다려 주세요.
- 사건 후보를 보여주기 전에도 연도, 사건명, 장소, 핵심 전개가 실제 역사 사실과 맞는지 먼저 확인해 주세요.
- 후보 단계에서 확신이 부족한 사건은 후보 목록에 넣지 말고, 검증 가능한 후보가 부족하면 "정보 없음"이라고 밝혀 주세요.

3. 사용자가 사건을 고른 뒤의 전체 구조와 순서
- 팩트 검증은 반드시 내부적으로 먼저 수행해 주세요.
- 사건명, 발생일, 장소, 주요 인물, 사건 원인, 사건 전개 핵심, 결과는 내부 점검용으로만 사용하고 최종 HTML 본문에는 그대로 노출하지 마세요.
- 최종 출력에는 "1단계: 팩트 검증", "2단계: 스토리 작성" 같은 점검용 문구를 절대 표시하지 마세요.
- 검증이 끝난 뒤에는 그 정보만 바탕으로 자연스러운 스토리텔링 본문을 작성하고, 최종 출력은 완성형 HTML만 보여 주세요.
- 상단 대표 썸네일 시작
- 도입, 배경 설명, 사건 발생, 전개, 결과, 정리의 흐름은 반드시 포함하되 제목으로 노출하지 말고 자연스럽게 녹여 주세요.
- 절대 고정된 소제목 구조를 사용하지 말고, 상황에 맞는 자연스러운 흐름형 소제목을 매번 새롭게 생성해 주세요.
- "사건 배경", "사건 전개", "결과 및 이후 변화", "사건 정리", "핵심 요약" 같은 템플릿형 제목은 절대 사용하지 마세요.
- 각 소제목은 설명형이 아니라 맥락형 문장으로 작성해 주세요.
- 소제목은 짧고 직관적이어야 하며, 너무 감성적이지 않지만 이야기처럼 읽혀야 합니다.
- 같은 패턴의 제목이나 비슷한 문장 구조를 반복하지 마세요.
- 본문 흐름 속 이미지 포함
- 마지막 요약 섹션도 고정 이름을 쓰지 말고, "짧게 정리하면", "한눈에 보면", "정리해보면", "여기서 남는 흐름은", "끝으로 묶어보면" 같은 자연스러운 표현으로 매번 다르게 변형해 주세요.
- 마지막 요약 섹션은 너무 짧지 않게, 정보 중심 리스트로 최소 5줄 이상 정리해 주세요.
- 가장 마지막에는 소제목을 또 만들기보다, 본문을 자연스럽게 닫아주는 짧은 마무리 멘트로 끝내 주세요.
- 가장 하단에는 해시태그를 여러 개 정리해 주세요.
- 이미지가 필요하다면 본문 흐름에 맞는 장면을 자연스럽게 제안하고, 필요 없으면 생략해 주세요.

4. 톤과 스타일
- ${toneGuide}
- 말하듯 자연스럽게 작성해 주세요.
- 지나치게 딱딱한 교과서 문체나 보고서 문체는 피하고, 이해하기 쉬운 역사 이야기 문체로 풀어 주세요.
- 어려운 내용을 풀어줄 때는 대중 강연처럼 쉬운 말로 설명하되, 과장하거나 연기하듯 말하지는 마세요.
- 한 문장 한 문장이 또박또박 들리는 느낌으로 쓰되, 너무 방송 대본처럼 과한 감탄이나 추임새는 넣지 말아 주세요.
- 소제목은 독자가 이야기 흐름을 따라가도록 돕는 맥락형 문장으로 작성해 주세요.
- 불필요한 설명을 길게 늘이지 말고 핵심만 또렷하게 정리해 주세요.
- 중간중간 장면과 분위기가 그려질 정도의 상황 묘사는 넣되, 과장되거나 추측성 표현은 넣지 말아 주세요.
- "그때 상황을 떠올려보면"처럼 자연스럽게 몰입을 유도하는 흐름은 사용할 수 있습니다.
- 독자가 중간중간 멈추고 생각할 수 있도록 읽는 호흡을 자연스럽게 정리해 주세요.
- 문단은 과하게 잘게 쪼개지 말고, 줄바꿈만 자연스럽게 조정해 주세요.
- 핵심 문장은 1~2곳 정도만 리듬감 있게 강조해 주세요.
- 쉼표, 문장 길이, 줄바꿈으로 읽는 호흡을 개선해 주세요.
- 문단 재배열, 소제목 추가, 톤 변경은 하지 말고 현재 글의 무게감을 유지해 주세요.

5. 사건 구성 방식
선정한 메인 사건은 아래 흐름을 유지하되, 소제목은 매번 내용에 맞게 새롭게 만들어 주세요.
- 도입부에서는 당시의 공기, 분위기, 사람 감정이 느껴지도록 현장처럼 시작해 주세요.
- 배경 설명에서는 노동 환경, 사회 분위기, 정치 상황 등 왜 이 사건이 벌어졌는지 이해되게 풀어 주세요.
- 사건 발생과 전개에서는 시간 흐름이 보이도록 갈등, 폭발, 충돌 구조를 자연스럽게 보여 주세요.
- 가능하다면 숫자, 규모, 기간 같은 구체 정보도 포함해 주세요.
- 결과 및 이후 변화에서는 사건이 어떻게 마무리됐고 이후 사회에 어떤 영향을 남겼는지 연결해 주세요.
- 정리 구간에서는 교훈을 억지로 만들지 말고, 확인된 결과와 이후 변화, 남은 쟁점이나 기록된 사실을 차분히 정리해 주세요.
- "왜 중요한가", "오늘날 우리가 배워야 할 점" 같은 교훈형 문장은 별도 항목으로 빼지 말고, 필요할 때만 전체 흐름 속에서 조심스럽게 드러나게 해 주세요.
- 인물 이름, 연도, 장소, 조직, 규모, 기간 같은 사실 요소는 본문에 넣기 전에 다시 한 번 확인해 주세요.
- 사실 확인이 애매한 숫자나 세부 묘사는 억지로 넣지 말고, 확인 가능한 범위까지만 정확하게 써 주세요.

6. 분량
- 블로그 기준으로 충분한 길이를 확보해 주세요.
- 분량은 블로그 본문 기준으로 중간 이상 길이로 작성해 주세요.
- 모바일로 읽었을 때도 충분히 읽을 내용이 있다고 느껴지는 수준으로 작성해 주세요.
- 다만 지나치게 길어지지는 않게, 핵심 배경과 흐름이 또렷하게 보이는 선에서 적절한 길이로 정리해 주세요.
- 너무 짧게 끝내지 말고, 한 사건을 중심으로 충분히 설명하되 늘어지지는 않게 정리해 주세요.${imageGuide}
- 단순 3~4단락 요약형으로 끝내지 말고, 도입, 배경, 사건 발생, 전개, 결과, 정리가 모두 자연스럽게 드러나게 작성해 주세요.
- 각 소제목 아래에는 최소 2~4문단 정도의 설명이 들어가게 해 주세요.
- 전체적으로 읽었을 때 짧은 소개글이 아니라 제대로 읽는 역사 블로그 글처럼 느껴져야 합니다.
- 독자가 이 글 하나만 읽어도 사건의 배경과 흐름을 이해할 수 있을 정도의 정보량을 확보해 주세요.
- 불필요하게 장황하게 늘이지 말고, 문단마다 새로운 정보나 맥락이 들어가게 해 주세요.
- 같은 의미를 반복하며 길이를 늘리지 말고, 문단마다 분명한 정보나 맥락이 있어야 합니다.

7. 금지 사항
- 논문처럼 딱딱하게 설명하지 말 것
- "~이다." 문장만 반복하지 말 것
- 과한 감정 연출 금지
- 사실이 불확실한 내용, 추측, 과장 금지
- 정보 없는 감성 글 금지
- 단순 요약형 글 금지
- AI 느낌 나는 반복 문장 금지
- contentReference, oaicite, citation, reference, source, placeholder, [1], [2], (출처), 참고문헌 같은 인용 표식이나 시스템 문자열을 본문에 출력하지 말 것
- 카드뉴스용 짧은 소개문처럼 끝나면 안 됩니다.
- 사실이 아닌 내용을 분위기 때문에 그럴듯하게 꾸며 넣는 것 금지
- 확인되지 않은 세부 묘사, 가공된 대사, 출처 없는 숫자 인용 금지
- 특정 강연자, 작가, 방송인의 말투를 그대로 흉내 내거나, 누구의 문체인지 바로 떠오를 정도로 모사하지 말 것
- 이미지가 필요할 때도 AI 일러스트나 포스터처럼 보이는 장면은 피하고, 실제 기록 사진이나 다큐멘터리 장면처럼 보이는 실사형 분위기를 우선해 주세요.
- 이미지 프롬프트 안에 ChatGPT, GPT, OpenAI 같은 생성 도구 이름이나 워터마크가 이미지에 나타나도록 요청하지 말아 주세요.
- 과한 연출, 지나치게 극적인 영화 포스터 톤, 부자연스러운 얼굴 표현은 피하고 차분한 실사 사진 느낌을 우선해 주세요.
- 이미지 프롬프트는 서로 재사용하지 말고, 장면마다 다른 구도와 분위기로 작성해 주세요.
- 군중 장면이 필요하더라도 인물을 과도하게 많이 넣지 말고, 6~10명 안팎의 자연스러운 인원 규모와 간격을 우선해 주세요.
- 사람이 몰려 있는 인공적인 군중 이미지보다, 조용한 긴장감이 보이는 실제 기록 사진 같은 구도를 우선해 주세요.

출력 형식
- 첫 단계 답변에서는 사건 후보 목록과 선택 질문만 보여 주세요.
- 사용자가 사건을 고른 다음 단계에서만 HTML 결과물을 작성해 주세요.
- HTML 안에 깨지는 텍스트가 들어가지 않도록 처리하고, 최종 HTML에는 사용자에게 보이는 텍스트만 포함해 주세요.
- HTML을 포함한 최종 출력 어디에도 contentReference, oaicite, citation, reference 같은 인용 토큰이나 시스템 표식이 남아 있으면 안 됩니다.
- 최종 HTML 블로그 본문에는 내부 점검용 항목인 사건명, 발생일, 장소, 주요 인물, 사건 원인, 사건 전개 핵심, 결과를 목록 형태로 따로 노출하지 말아 주세요.
- 최종 결과물은 블로그에 바로 붙여 넣을 수 있는 완성형 HTML만 출력해 주세요.
- HTML title과 화면 상단 h1 모두 새로 다듬은 제목을 사용해 주세요.
- 제목은 분위기만 강조하지 말고, 독자가 어떤 사건인지 바로 이해할 수 있게 작성해 주세요.
- 사건명 또는 핵심 키워드는 제목에 자연스럽게 포함해 주세요.
- 다만 위키백과 제목처럼 딱딱하게 쓰지는 말고, 역사 블로그 제목처럼 읽히게 구성해 주세요.
- 제목은 "사건 설명 + 분위기"가 함께 느껴지는 형태를 우선해 주세요.
- 화면에 보이는 상단 제목(h1)에는 주제와 어울리는 이모지를 1개 포함해 주세요.
- "엔진 소리가 다시 울리던 날", "조용히 흔들리던 도시"처럼 사건이 무엇인지 알 수 없는 제목은 피해 주세요.
- 상단 썸네일 아래에서 바로 도입부가 이어지게 해 주세요.
- 본문은 한 사건을 중심으로 이어지는 이야기처럼 흘러가게 해 주세요.
- 사건 사이를 나누는 설명보다 하나의 이야기처럼 읽히는 구성을 우선해 주세요.
- h2/h3에는 고정 타이틀을 넣지 말고, 내용과 분위기에 맞는 제목을 매번 새롭게 생성해 주세요.
- 각 h2/h3 제목 앞에는 해당 문단 흐름과 어울리는 이모지를 1개씩 붙여, 섹션이 눈에 잘 들어오게 해 주세요.
- 제목 자체가 템플릿처럼 보이지 않게 하고, 이모지도 같은 패턴으로 반복하지 말아 주세요.
- 사건 개요만 훑고 끝내지 말고, 왜 그런 일이 벌어졌는지와 이후 어떤 변화나 기록을 남겼는지까지 자연스럽게 연결해 주세요.
- 사건 설명은 감상 위주가 아니라 사실과 맥락이 살아 있게 풀어 주세요.
- 본문 이미지가 2개 들어간다면 서로 비슷한 장면으로 반복하지 말고, 하나는 시대 분위기나 공간 중심, 다른 하나는 사건 핵심 인물이나 상징 장면 중심처럼 차이를 분명히 두어 주세요.
- 상단 대표 이미지는 사건 분위기 전체를 보여주는 장면이어야 합니다.
- 본문 중간 이미지는 사건 상황과 직접 연결되어야 하며, 매번 같은 스타일로 반복되지 않아야 합니다.
- 이미지 프롬프트가 들어간다면 본문 내용과 직접 연결되는 장면만 사용하고, 필요 없는 장면은 억지로 추가하지 말아 주세요.
- 가장 하단 요약 섹션도 "핵심 요약" 같은 고정 이름을 쓰지 말고, 자연스럽게 변형된 제목을 사용해 주세요.
- 마지막 마무리 문장은 별도 소제목 없이, 오늘 이야기를 조용히 정리해 주는 한두 문장으로 마감해 주세요.
- 글의 맨 아래에는 #오늘의역사 형태의 해시태그를 6~10개 정도 한 줄 또는 두 줄로 자연스럽게 정리해 주세요.

추가 기준
- ${koreaGuide}
- 사건은 반드시 사실 기반으로만 정리해 주세요.
- 가능하면 신뢰할 수 있는 역사 자료, 공공기관 자료, 박물관/기념관 자료, 사료에 기반해 교차 확인해 주세요.
- 서로 다른 자료에서 다르게 전해지는 부분이 있다면 단정하지 말고, 널리 합의된 사실만 중심으로 정리해 주세요.
- 연도는 자연스럽게 드러나야 하고, 역사 입문자도 쉽게 이해할 수 있어야 합니다.
- 결과물은 내가 다른 AI에게 전달해서 HTML 완성본이나 다운로드 가능한 HTML 파일 형태로 받기 위한 요청문이므로, 그 의도가 흔들리지 않게 유지해 주세요.${excludeGuide}
- html 파일로 다운로드할 수 있게 결과물을 제공해 주세요.
`.trim();

  return { title, prompt, subTopic, keywords, includeHtml: false };
};

// ── 노래 프롬프트 생성 ────────────────────────────────────────
export const generateSongPrompt = (
  form: SongDraftForm
): GeneratedPrompt => {
  const MUSIC_PURPOSE_OPTIONS: Record<MusicPurpose, string> = {
    youtube_focus: '유튜브 조회수형 / 공부·집중',
    cooking_bgm: '요리·브이로그 BGM',
    daily_listen: '일상에서 듣기 좋은 노래',
    emotional_playlist: '감성 플레이리스트',
    cafe_bgm: '카페·휴식 음악',
    shorts_bgm: '쇼츠·릴스용 짧은 음악',
    general_music: '그 외(기타)',
  };
  const OUTPUT_TYPE_LABELS = {
    song: '일반 노래',
    hook_short: '숏츠/릴스용 짧은 훅 음악',
    instrumental: '무보컬 연주/BGM',
    ambience_asmr: '환경 사운드/ASMR',
  } as const;
  const DURATION_LABELS = {
    d15: '15초',
    d30: '30초',
    d60: '1분',
    d180: '3분',
    d210: '3분 30초',
    auto: 'AI 추천',
  } as const;
  const DURATION_PROMPTS = {
    d15: '15-second short-form structure, instant hook within the first 1 second, one memorable motif, no slow intro, fast payoff',
    d30: '30-second short-form structure, fast hook, repeat-friendly core section, loop-friendly ending, no long intro',
    d60: 'around 60 seconds, short complete arc, quick development, memorable section, concise but finished structure',
    d180: 'around 3 minutes, full song structure with verse and chorus development, balanced pacing, satisfying ending',
    d210: 'around 3 minutes 30 seconds, full release-ready structure with intro, verse, chorus, bridge, natural progression and ending',
    auto: 'choose the most suitable duration for the intent while keeping the structure concise and usable',
  } as const;
  const DISTRIBUTION_LABELS = {
    social_only: 'SNS 업로드 전용',
    release_only: '음원 등록 전용',
    social_and_release: 'SNS와 음원 등록 동시 고려',
  } as const;
  const VERSION_LABELS = {
    original: '원곡 버전',
    short_edit: '숏폼 편집 버전',
    instrumental: '연주 버전',
    acoustic: '어쿠스틱 버전',
    ambient: '앰비언트 버전',
  } as const;
  const VOCAL_MODE_LABELS = {
    with_lyrics: '가사 포함 보컬곡',
    vocalize_only: '허밍/보컬라이즈 중심',
    instrumental_only: '무보컬 연주곡',
    ambience_only: '환경 사운드 전용',
  } as const;
  const HOOK_LABELS = {
    low: '낮음',
    medium: '보통',
    high: '강함',
  } as const;
  const LOOP_LABELS = {
    loopable: '루프형',
    natural_ending: '자연 종료형',
  } as const;

  const instrumentPromptMap: Record<InstrumentType, string> = {
    piano: 'soft emotional piano, clean natural tone',
    acoustic_guitar: 'warm acoustic guitar, gentle fingerpicking',
    electric_guitar: 'clean electric guitar, ambient reverb, soft melodic lines',
    lofi_keys: 'lofi keys, warm analog texture, subtle vinyl atmosphere',
    strings: 'soft cinematic strings, gentle orchestral layers',
    synth_pad: 'ambient synth pads, dreamy spacious texture',
    jazz_piano: 'smooth jazz piano, warm lounge atmosphere',
    ai_recommend_single:
      'choose one single best-fit instrument based on the theme, mood, and extra notes, use only one main instrument, do not mix multiple lead instruments',
    mixed: 'soft piano, warm acoustic guitar, subtle ambient pads',
  };
  const instrumentLabelMap: Record<InstrumentType, string> = {
    piano: '피아노',
    acoustic_guitar: '통기타',
    electric_guitar: '일렉 기타',
    lofi_keys: '로파이 건반',
    strings: '스트링',
    synth_pad: '신스 패드',
    jazz_piano: '재즈 피아노',
    ai_recommend_single: '요청에 맞게 AI 추천',
    mixed: 'AI 추천 믹스',
  };
  const outputTypePromptMap = {
    song: [
      'full melodic song',
      'emotional progression',
      'memorable chorus',
      'balanced verse and chorus',
      'natural build-up',
      'emotionally satisfying ending',
    ],
    hook_short: [
      'short-form viral music',
      'immediate hook',
      'catchy motif',
      'fast emotional engagement',
      'repeatable chorus fragment',
      'loop-friendly ending',
      'no slow intro',
    ],
    instrumental: [
      'no vocals',
      'instrumental focused',
      'warm acoustic texture',
      'natural performance dynamics',
      'clear room ambience',
      'musical but unobtrusive',
    ],
    ambience_asmr: [
      'ambient soundscape',
      'realistic environmental texture',
      'immersive ambience',
      'natural stereo space',
      'no vocals',
      'no prominent melody',
      'subtle environmental movement',
      'seamless ambience loop',
    ],
  } as const;

  const topic = form.topic.trim() || '감성 음악';
  const mood = form.mood.trim() || '따뜻함과 편안함';
  const genre = form.genre.trim() || 'lofi piano';
  const tempo = form.tempo.trim() || '70-85 BPM';
  const language =
    form.languageOption === 'Korean'
      ? 'Korean'
      : form.languageOption === 'English'
        ? 'English'
        : form.language.trim();
  const voiceStyle = form.voiceStyle.trim();
  const lyricStyle = form.lyricStyle.trim();
  const keywords = form.keywords
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean);
  const extra = form.extraNotes.trim();

  const input: SongPromptInput = {
    purpose: form.purpose,
    outputType: form.outputType,
    durationTarget: form.durationTarget,
    distributionIntent: form.distributionIntent,
    versionType: form.versionType,
    vocalMode: form.vocalMode,
    topic,
    mood,
    genre,
    tempo,
    instrument: form.instrument,
    vocalGender: form.gender,
    hookStrength: form.hookStrength,
    loopMode: form.loopMode,
    vocalStyle: voiceStyle,
    lyricStyle,
    lyricDensity: form.lyricDensity,
    language,
    keywords: keywords.join(', '),
    extra,
  };

  const baseSafetyNotes = [
    'unique arrangement',
    'original composition style',
    'original chord progression',
    'non-generic hook',
    'avoid similarity to existing songs',
    'avoid artist imitation',
    'avoid copyrighted melody',
    'avoid recognizable commercial music patterns',
    'content-id safe direction',
    'suitable for original music distribution',
  ];
  const ambienceSafetyNotes = [
    'original generated soundscape',
    'no copyrighted samples',
    'no recognizable commercial sound effects',
    'realistic generated ambience',
    'avoid reused sample-library feel',
    'seamless and original ambience',
    'suitable for original sound distribution',
  ];
  const negativeConstraints = [
    'do not imitate any named artist',
    'do not recreate existing songs',
    'do not reference famous OSTs or ad music',
    'avoid recognizable commercial music patterns',
    'avoid copied melody contours',
    'avoid overused preset-demo feel',
  ];
  const distributionSafetyNotes = [
    '특정 유명 곡과 유사하지 않은지 직접 청취 검수 필요',
    '특정 아티스트 스타일 직접 모방은 피해야 합니다',
    '특정 OST나 광고 음악을 연상시키는지 확인이 필요합니다',
    '반복 생성본끼리도 서로 유사성이 생기지 않는지 확인이 필요합니다',
    '업로드 전 Content ID 결과를 직접 점검해야 합니다',
    '사용 플랫폼의 AI 음악 정책과 상업 사용 정책을 직접 확인해야 합니다',
  ];

  const getVocalPrompt = (vocalGender: VocalGender) => {
    if (vocalGender === 'female') return 'female vocal, emotional and clear tone';
    if (vocalGender === 'male') return 'male vocal, warm and natural tone';
    if (vocalGender === 'mixed') return 'mixed male and female vocals, balanced harmony';
    return 'natural vocal tone selected to fit the mood';
  };
  const getVocalModePrompt = (vocalMode: SongDraftForm['vocalMode']) => {
    if (vocalMode === 'with_lyrics') return 'with vocals and clear lyrical delivery';
    if (vocalMode === 'vocalize_only') return 'wordless vocalization, humming, vocal chops, minimal lyrics';
    if (vocalMode === 'instrumental_only') return 'strictly instrumental, no vocals';
    return 'ambience only, no vocals, no prominent melody';
  };

  const splitList = (value: string) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const arrangementNotes = [
    `${OUTPUT_TYPE_LABELS[form.outputType]} 방향`,
    `${DURATION_LABELS[form.durationTarget]} 기준 구조`,
    `${LOOP_LABELS[form.loopMode]} 마무리`,
    form.outputType === 'hook_short' ? `훅 강도 ${HOOK_LABELS[form.hookStrength]}` : '',
    form.outputType === 'instrumental' && form.instrument === 'acoustic_guitar'
      ? 'fingerpicking, subtle pick scraping, chord transition noise, intimate room tone'
      : '',
    form.instrument === 'ai_recommend_single'
      ? '주제와 기타 설명에 맞춰 가장 어울리는 악기 한 가지만 선택하고, 여러 리드 악기를 섞지 않기'
      : '',
    form.outputType === 'ambience_asmr'
      ? 'no melody, no vocals, immersive environmental movement, sleep and focus friendly'
      : '',
    form.extraNotes.trim(),
  ].filter(Boolean);

  const draft: SongPromptDraft = {
    outputType: form.outputType,
    durationTarget: form.durationTarget,
    distributionIntent: form.distributionIntent,
    versionType: form.versionType,
    vocalMode: form.vocalMode,
    topic,
    purpose: MUSIC_PURPOSE_OPTIONS[form.purpose],
    mood: splitList(mood),
    genre: splitList(genre),
    instrumentation: [
      form.instrument === 'ai_recommend_single'
        ? 'AI가 주제와 설명에 맞는 단일 악기 1종 선택'
        : instrumentLabelMap[form.instrument],
    ],
    bpm: tempo,
    hookStrength: form.outputType === 'hook_short' ? form.hookStrength : undefined,
    loopMode: form.loopMode,
    vocalProfile:
      form.vocalMode === 'instrumental_only' || form.vocalMode === 'ambience_only'
        ? undefined
        : {
            gender: form.gender,
            tone: voiceStyle || undefined,
            style: voiceStyle || undefined,
            language: language || undefined,
          },
    lyricProfile:
      form.vocalMode === 'with_lyrics'
        ? {
            style: lyricStyle || undefined,
            density: form.lyricDensity,
            hookRepeat: form.outputType === 'hook_short',
          }
        : undefined,
    arrangementNotes,
    negativeConstraints,
    safetyNotes: form.outputType === 'ambience_asmr' ? ambienceSafetyNotes : baseSafetyNotes,
    distributionSafetyNotes: [
      ...distributionSafetyNotes,
      form.distributionIntent === 'social_and_release'
        ? '숏츠용과 배포용 원본은 분리 관리하는 편이 안전합니다'
        : '',
      form.distributionIntent === 'social_and_release'
        ? '동일 마스터를 여러 플랫폼에 반복 업로드할 때 자기 Content ID 충돌 가능성이 있습니다'
        : '',
      form.distributionIntent === 'social_and_release'
        ? 'short_edit 버전을 별도로 저장하고 메타데이터도 구분하는 편이 좋습니다'
        : '',
    ].filter(Boolean),
  };

  const buildDraftPrompt = (songDraft: SongPromptDraft) => `출력 유형: ${OUTPUT_TYPE_LABELS[songDraft.outputType]}
길이 목표: ${DURATION_LABELS[songDraft.durationTarget]}
배포 의도: ${DISTRIBUTION_LABELS[songDraft.distributionIntent]}
버전 타입: ${VERSION_LABELS[songDraft.versionType]}
보컬 모드: ${VOCAL_MODE_LABELS[songDraft.vocalMode]}
주제: ${songDraft.topic}
목적: ${songDraft.purpose}
분위기: ${songDraft.mood.join(', ') || '미입력'}
장르: ${songDraft.genre.join(', ') || '미입력'}
악기: ${songDraft.instrumentation.join(', ')}
템포/BPM: ${songDraft.bpm || 'AI 추천'}
훅 강도: ${songDraft.hookStrength ? HOOK_LABELS[songDraft.hookStrength] : '해당 없음'}
루프 모드: ${LOOP_LABELS[songDraft.loopMode || 'natural_ending']}
보컬 프로필: ${
    songDraft.vocalProfile
      ? `${songDraft.vocalProfile.gender ?? 'AI 추천'} / ${songDraft.vocalProfile.style ?? '미입력'} / ${songDraft.vocalProfile.language ?? 'AI 추천'}`
      : '없음'
  }
가사 프로필: ${
    songDraft.lyricProfile
      ? `${songDraft.lyricProfile.style ?? '미입력'} / 밀도 ${songDraft.lyricProfile.density ?? 'balanced'} / 훅 반복 ${songDraft.lyricProfile.hookRepeat ? '권장' : '선택'}`
      : '없음'
  }
구성 메모:
- ${songDraft.arrangementNotes.join('\n- ')}
금지 조건:
- ${songDraft.negativeConstraints.join('\n- ')}
안전 메모:
- ${songDraft.safetyNotes.join('\n- ')}`;

  const buildRefinementPrompt = (songDraft: SongPromptDraft) => `당신은 AI 음악 제작 보조 시스템입니다.
아래 구조화 초안을 바탕으로, 특정 아티스트나 유명 곡을 모방하지 않는 방향으로 최종 Suno AI 프롬프트를 다듬어 주세요.

[구조화 초안]
${buildDraftPrompt(songDraft)}

[출력 조건]
- 영어 위주의 Suno 입력 프롬프트 1개
- 과한 장식 없이 명확한 구조
- 선택된 길이 목표 하나만 반영
- ${
    songDraft.outputType === 'ambience_asmr'
      ? '멜로디와 보컬을 최대한 배제하고 환경 사운드 중심으로 정리'
      : '선택된 결과물 유형에 맞는 구조만 유지'
  }
- 특정 가수, 특정 곡, OST, 광고 음악, 유명 스타일 직접 언급 금지
- 배포 안정성 문구를 끝부분에 자연스럽게 포함`;

  const buildFinalSunoPrompt = (songInput: SongPromptInput, songDraft: SongPromptDraft) => {
    const parts = [
      ...outputTypePromptMap[songDraft.outputType],
      `purpose: ${MUSIC_PURPOSE_OPTIONS[songInput.purpose]}`,
      `theme: ${songInput.topic}`,
      songInput.mood ? `mood: ${songInput.mood}` : '',
      songInput.genre ? `genre: ${songInput.genre}` : '',
      songInput.tempo ? `tempo or bpm: ${songInput.tempo}` : '',
      `duration target: ${DURATION_PROMPTS[songInput.durationTarget]}`,
      `version: ${VERSION_LABELS[songInput.versionType]}`,
      `loop mode: ${songInput.loopMode}`,
      instrumentPromptMap[songInput.instrument],
      songInput.instrument === 'ai_recommend_single'
        ? 'select one single instrument only, based on the request, avoid multi-instrument blend'
        : '',
      getVocalModePrompt(songInput.vocalMode),
      songInput.vocalMode !== 'instrumental_only' && songInput.vocalMode !== 'ambience_only'
        ? getVocalPrompt(songInput.vocalGender)
        : '',
      songInput.vocalMode === 'with_lyrics' && songInput.vocalStyle
        ? `vocal style: ${songInput.vocalStyle}`
        : '',
      songInput.vocalMode === 'with_lyrics' && songInput.lyricStyle
        ? `lyric style: ${songInput.lyricStyle}`
        : '',
      songInput.vocalMode === 'with_lyrics'
        ? `lyric density: ${songInput.lyricDensity}`
        : '',
      songInput.vocalMode !== 'instrumental_only' &&
      songInput.vocalMode !== 'ambience_only' &&
      songInput.language
        ? `language: ${songInput.language}`
        : '',
      songInput.outputType === 'hook_short'
        ? `hook strength: ${songInput.hookStrength}, first 1-2 seconds must land immediately`
        : '',
      songInput.keywords ? `keywords: ${songInput.keywords}` : '',
      songInput.extra ? `additional direction: ${songInput.extra}` : '',
      ...songDraft.safetyNotes,
    ];

    return parts.filter(Boolean).join(', ');
  };

  const buildDescriptionKo = (songInput: SongPromptInput) => {
    const typeLabel = OUTPUT_TYPE_LABELS[songInput.outputType];
    const durationLabel = DURATION_LABELS[songInput.durationTarget];
    const vocalLabel = VOCAL_MODE_LABELS[songInput.vocalMode];

    return [
      `이 결과는 ${typeLabel} 방향으로 설계한 AI 음악/사운드 프롬프트입니다.`,
      `길이는 ${durationLabel} 기준만 반영했고, 배포 의도는 ${DISTRIBUTION_LABELS[songInput.distributionIntent]}로 잡았습니다.`,
      `주제는 "${songInput.topic}", 분위기는 "${songInput.mood}" 중심으로 정리했습니다.`,
      `보컬/사운드 방식은 ${vocalLabel}이며, 주요 악기 방향은 ${instrumentLabelMap[songInput.instrument]}입니다.`,
      songInput.outputType === 'ambience_asmr'
        ? '멜로디보다 환경 질감과 공간감을 우선하고, 자연스럽게 반복 가능한 사운드스케이프를 목표로 합니다.'
        : '특정 곡이나 특정 아티스트 모방을 피하면서도 실제 제작에 바로 써먹을 수 있는 방향으로 정리했습니다.',
    ].join(' ');
  };

  const buildYoutubeTitles = (songInput: SongPromptInput) => {
    const safeTopic = songInput.topic || '감성 음악';

    if (songInput.purpose === 'youtube_focus') {
      return [
        `${safeTopic} 집중할 때 듣기 좋은 음악`,
        `${safeTopic} Study Music for Deep Focus`,
        '조용히 몰입하고 싶을 때 듣는 BGM',
      ];
    }

    if (songInput.purpose === 'cooking_bgm') {
      return [
        `${safeTopic} 요리할 때 듣기 좋은 산뜻한 BGM`,
        'Cooking Vlog Music | Cozy Kitchen BGM',
        '요리 영상에 어울리는 따뜻한 브금',
      ];
    }

    if (songInput.purpose === 'daily_listen') {
      return [
        `${safeTopic} 일상에서 편하게 듣기 좋은 노래`,
        `${safeTopic} Easy Listening Pop Song`,
        '하루 끝에 듣기 좋은 편안한 음악',
      ];
    }

    if (songInput.purpose === 'emotional_playlist') {
      return [
        `${safeTopic} 감성 플레이리스트`,
        `Emotional Night Playlist | ${safeTopic}`,
        '조용한 밤에 듣기 좋은 감성 음악',
      ];
    }

    if (songInput.purpose === 'cafe_bgm') {
      return [
        `${safeTopic} 카페에서 듣기 좋은 음악`,
        'Cozy Cafe Music | Relaxing BGM',
        '편안한 오후를 위한 카페 브금',
      ];
    }

    if (songInput.purpose === 'general_music') {
      return [
        `${safeTopic} 편하게 듣기 좋은 오리지널 음악`,
        `${safeTopic} Original Easy Listening Music`,
        '가볍게 틀어두기 좋은 분위기 음악',
      ];
    }

    return [
      `${safeTopic} 쇼츠에 어울리는 짧은 BGM`,
      'Shorts BGM | Catchy Short Music',
      '릴스와 쇼츠에 쓰기 좋은 음악',
    ];
  };

  const buildYoutubeDescription = (songInput: SongPromptInput) => `이 결과물은 ${MUSIC_PURPOSE_OPTIONS[songInput.purpose]} 용도로 기획한 AI 기반 오리지널 ${OUTPUT_TYPE_LABELS[songInput.outputType]}입니다.

주제: ${songInput.topic || '미입력'}
분위기: ${songInput.mood || '미입력'}
장르: ${songInput.genre || '미입력'}
템포: ${songInput.tempo || '미입력'}
길이 목표: ${DURATION_LABELS[songInput.durationTarget]}
보컬/사운드 방식: ${VOCAL_MODE_LABELS[songInput.vocalMode]}
배포 의도: ${DISTRIBUTION_LABELS[songInput.distributionIntent]}

업로드 전에는 실제 결과물을 직접 청취하면서 멜로디 유사성, 사운드 샘플 유사성, Content ID 가능성, 플랫폼 정책 적합성을 함께 확인해 주세요.

※ 특정 아티스트, 곡명, OST, 광고 음악을 직접 연상시키는 메타데이터는 피하는 편이 안전합니다.
※ AI 생성 음악 특성상 상업 사용 전 최종 권리와 유통 정책은 사용하는 플랫폼 기준으로 다시 확인해 주세요.`;

  const draftPrompt = buildDraftPrompt(draft);
  const refinementPrompt = buildRefinementPrompt(draft);
  const finalSunoPrompt = buildFinalSunoPrompt(input, draft);
  const descriptionKo = buildDescriptionKo(input);
  const youtubeTitles = buildYoutubeTitles(input);
  const youtubeDescription = buildYoutubeDescription(input);
  const tagRequestPrompt = `이 음악/사운드의 목적은 ${MUSIC_PURPOSE_OPTIONS[input.purpose]}, 결과물 유형은 ${OUTPUT_TYPE_LABELS[input.outputType]}입니다.
주제는 "${input.topic}"이고 분위기는 "${input.mood}"입니다.
유튜브 업로드용 태그를 8~12개 추천해 주세요.
한글 태그와 영문 태그를 자연스럽게 섞어도 좋지만, 특정 실존 아티스트명, 곡명, OST명, 광고 음악명은 넣지 말아 주세요.`;
  const contentIdChecks = [
    '특정 유명 곡과 비슷하게 들리는 구간이 없는지 직접 들어보고 확인해야 합니다.',
    '특정 아티스트 스타일을 바로 떠올리게 하는지 점검이 필요합니다.',
    '동일 프롬프트로 여러 번 생성한 결과끼리도 서로 유사성이 생길 수 있습니다.',
    '업로드 전 실제 플랫폼에서 Content ID 결과를 확인하는 과정이 필요합니다.',
  ];
  const distributionSafetyCheck = [
    ...draft.distributionSafetyNotes,
    '이 결과는 유사성 감소를 돕는 보조 도구일 뿐이며, 최종 안전성을 보장하지는 않습니다.',
  ];
  const preReleaseChecklist = [
    '특정 아티스트 이름을 직접 사용했는지 확인',
    '유명 곡명, OST명, 광고 음악명을 메타데이터에 넣지 않았는지 확인',
    '멜로디 또는 핵심 사운드가 기존 작품과 유사하지 않은지 직접 청취',
    '반복 생성본끼리 유사성이 과도하지 않은지 비교',
    'Content ID 결과를 실제 업로드 환경에서 확인',
    '배포 플랫폼의 AI 음악 정책 확인',
    '상업 사용 가능 여부와 권리 정책 확인',
  ];
  const contentIdWarning =
    'AI 생성 음악은 유사성 감소 문구를 넣어도 Content ID 충돌이나 정책 이슈가 완전히 사라지지 않습니다. 최종 업로드 전 직접 청취 검수와 플랫폼 정책 확인이 필요합니다.';
  const metadataNamingCaution = [
    '실존 아티스트명을 제목, 설명, 태그에 직접 넣지 마세요.',
    '실존 곡명이나 OST명을 암시하는 제목은 피하세요.',
    'in the style of 같은 표현은 사용하지 마세요.',
    '짧은 숏폼과 배포용 원본은 제목과 버전명을 구분해 관리하는 편이 좋습니다.',
  ];

  const songData: SongGeneratedData = {
    draft,
    input,
    draftPrompt,
    refinementPrompt,
    finalSunoPrompt,
    descriptionKo,
    youtubeTitles,
    youtubeDescription,
    tagRequestPrompt,
    contentIdChecks,
    distributionSafetyCheck,
    preReleaseChecklist,
    contentIdWarning,
    metadataNamingCaution,
  };

  const title = `노래 생성 결과: ${topic}`;
  const prompt = `## 1차 구조화 초안

${draftPrompt}

## 일반 AI 정제 요청문

${refinementPrompt}

## 최종 Suno AI 프롬프트

${finalSunoPrompt}

## 한국어 설명

${descriptionKo}

## 배포 안정성 체크

- ${distributionSafetyCheck.join('\n- ')}

## Content ID 주의 문구

${contentIdWarning}

## 📺 유튜브 제목 추천

1. ${youtubeTitles[0]}
2. ${youtubeTitles[1]}
3. ${youtubeTitles[2]}

## 📝 유튜브 설명 초안

${youtubeDescription}

## #️⃣ 태그 추천

${tagRequestPrompt}

## 음원 등록 전 체크리스트

- ${preReleaseChecklist.join('\n- ')}

## 메타데이터 작성 주의사항

- ${metadataNamingCaution.join('\n- ')}`;

  return {
    title,
    prompt,
    subTopic: topic,
    keywords: keywords.length > 0 ? keywords : [topic, input.genre, input.mood].filter(Boolean),
    includeHtml: false,
    songData,
  };
};

// ── 영상 프롬프트 생성 ────────────────────────────────────────
export const generateVideoPrompt = (
  form: VideoDraftForm
): GeneratedPrompt => {
  const purposeLabelMap = {
    shorts: '쇼츠',
    movie_trailer: '영화 예고편',
    game_trailer: '게임 트레일러',
    product_promo: '제품 홍보',
    portrait: '인물 포트레이트',
  } as const;
  const backgroundMap = {
    mountain: 'mountainous terrain',
    city: 'dense cinematic city',
    forest: 'deep forest with cinematic depth',
    space: 'cosmic outer space environment',
    ocean: 'open ocean with dramatic atmosphere',
    indoor: 'stylized indoor cinematic set',
    custom: form.customBackground.trim() || 'custom environment',
  } as const;
  const moodMap = {
    epic: 'epic, intense, cinematic',
    dark: 'dark, moody, shadow-heavy',
    emotional: 'emotional, soft, cinematic',
    tense: 'tense, suspenseful, high-pressure',
    futuristic: 'futuristic, sleek, high-tech',
    calm: 'calm, restrained, atmospheric',
  } as const;
  const actionMap = {
    intro_appearance: 'intro appearance or opening visual beat',
    movement: 'movement or approach through the environment',
    main_action: 'main action moment',
    emotion_shift: 'emotional shift or reaction beat',
    close_up: 'close-up emphasis on the subject',
    scene_transition: 'scene transition or perspective change',
    finale: 'finale or closing visual beat',
    product_highlight: 'product highlight or subject emphasis',
    background_highlight: 'background or location emphasis',
    slow_motion: 'slow motion moment',
    camera_rotation: 'camera rotation around the subject',
    detail_cut: 'detail-focused insert shot',
  } as const;
  const cameraMap = {
    continuous_shot: 'continuous shot',
    handheld_cinematic: 'handheld cinematic',
    tracking_shot: 'tracking shot',
    drone_wide: 'drone wide',
    close_up: 'close-up',
  } as const;
  const lengthShotMap = {
    '5s': 3,
    '8s': 4,
    '15s': 7,
    '30s': 10,
  } as const;
  const lengthSecondsMap = {
    '5s': 5,
    '8s': 8,
    '15s': 15,
    '30s': 30,
  } as const;

  const topic = form.characterDescription.trim();
  const background = backgroundMap[form.background];
  const mood = moodMap[form.mood];
  const actions = form.actions.length > 0
    ? form.actions.map((item) => actionMap[item]).join(', ')
    : 'subtle cinematic movement';
  const cameras = form.cameraStyles.length > 0
    ? form.cameraStyles.map((item) => cameraMap[item]).join(', ')
    : 'continuous shot';
  const safetyParts = [
    form.physicsBoost ? 'realistic physics, gravity, weight, inertia' : '',
    form.objectVisibility ? 'no teleportation, object remains visible' : '',
    form.identityLock ? 'identity lock, preserve exact face and proportions' : '',
    form.cameraContinuity ? 'single continuous shot, no cuts, no resets' : '',
    form.errorPrevention ? 'no body distortion, no face change, no extra limbs, no broken motion' : '',
    form.styleConsistency ? 'consistent visual style across all shots' : '',
    form.backgroundConsistency ? 'consistent background continuity across the sequence' : '',
  ].filter(Boolean);

  const generateVideoDraftPrompt = () =>
    `A ${mood} video sequence set in ${background}. ${form.useReferenceImage ? 'Use the provided reference image for the main character identity. ' : ''}The main character is ${topic}. The action includes ${actions}. Camera style: ${cameras}. ${form.dialogueMode === 'custom' && form.dialogue.trim() ? `Optional dialogue: "${form.dialogue.trim()}". ` : ''}${form.extraRequest.trim() ? `Additional direction: ${form.extraRequest.trim()}. ` : ''}`.trim();

  const generateVideoSafetyPrompt = () => safetyParts.join(', ');

  const generateVideoSequencePrompt = () => {
    const base = generateVideoDraftPrompt();
    const safety = generateVideoSafetyPrompt();
    return `${base} The camera follows the character in one cinematic sequence for ${lengthSecondsMap[form.length]} seconds. ${safety}${safety ? ', ' : ''}keep motion readable and visually continuous.`.trim();
  };

  const shotCount = lengthShotMap[form.length];
  const totalSeconds = lengthSecondsMap[form.length];
  const shotLines = Array.from({ length: shotCount }, (_, index) => {
    const start = ((totalSeconds / shotCount) * index).toFixed(1);
    const end = ((totalSeconds / shotCount) * (index + 1)).toFixed(1);
    const actionText =
      form.actions[index] ? actionMap[form.actions[index]] : form.actions[form.actions.length - 1] ? actionMap[form.actions[form.actions.length - 1]] : 'cinematic movement beat';
    return `Shot ${index + 1} (${start}–${end}s) — ${actionText}, camera emphasis: ${form.cameraStyles[index % (form.cameraStyles.length || 1)] ? cameraMap[form.cameraStyles[index % form.cameraStyles.length]] : 'continuous shot'}`;
  });

  const keywords = [
    purposeLabelMap[form.purpose],
    form.customBackground.trim() || background,
    ...form.actions.map((item) => actionMap[item]),
  ].filter(Boolean);

  const title = `영상 시퀀스 프롬프트: ${topic}`;
  const prompt = `## 🎬 생성 결과 제목

${title}

## 🧾 입력 요약

- 영상 목적: ${purposeLabelMap[form.purpose]}
- 레퍼런스 이미지 사용: ${form.useReferenceImage ? '사용' : '미사용'}
- 배경: ${background}
- 분위기: ${mood}
- 액션 흐름: ${actions}
- 카메라 스타일: ${cameras}
- 영상 길이: ${totalSeconds}초

## ✍️ 초안 프롬프트

${generateVideoDraftPrompt()}

## 🚀 최종 시퀀스 프롬프트

${generateVideoSequencePrompt()}

## 🎞️ Shot별 구성

${shotLines.join('\n')}

## 🛡️ 안정화 문구

${generateVideoSafetyPrompt() || 'single continuous shot, readable motion, stable character consistency'}

## 📋 복사용 안내

이 결과를 그대로 AI 영상 생성 도구에 붙여넣고, 필요하면 Shot별 구성만 개별 장면 프롬프트로 나눠 사용하세요.`;

  return { title, prompt, subTopic: topic, keywords, includeHtml: false };
};
