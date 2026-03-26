import type { PromptTemplate } from '../../types/prompt'

export const marketTemplates: PromptTemplate[] = [
  {
    id: 'market-briefing',
    categoryId: 'market',
    name: '시장 브리핑',
    description: '미국 증시, ETF, 시장 흐름을 설명형으로 정리하는 템플릿입니다.',
    fields: [
      {
        id: 'topic',
        label: '주제',
        type: 'text',
        placeholder: '예: 미국 증시 하루 요약 / 반도체 ETF 흐름',
      },
      {
        id: 'keywords',
        label: '키워드',
        type: 'tags',
        placeholder: '예: S&P500, 나스닥, 금리, 엔비디아, CPI',
      },
      {
        id: 'summary',
        label: '설명',
        type: 'textarea',
        placeholder: '오늘 분위기나 해석 포인트를 적어주세요.',
      },
      {
        id: 'goal',
        label: '목적',
        type: 'text',
        placeholder: '예: 초보자도 이해할 수 있는 시장 브리핑 글',
      },
      {
        id: 'length',
        label: '분량',
        type: 'text',
        placeholder: '예: 핵심 위주 1,200자 내외',
      },
      {
        id: 'include',
        label: '필수 포함 요소',
        type: 'tags',
        placeholder: '예: 시장 분위기, 주요 지수, 핵심 뉴스, 체크 포인트',
      },
      {
        id: 'exclude',
        label: '피해야 할 표현',
        type: 'tags',
        placeholder: '예: 투자 권유, 확정적 전망, 선동적 문장',
      },
    ],
    resultFormat: `당신은 한국어 정보형 블로그 전문 콘텐츠 에디터이자 SEO 기반 콘텐츠 전략가다.

아래 주제로 블로그용 시장 요약 글 작성 프롬프트를 만들어줘.

주제: {{topic}}
핵심 키워드: {{keywords}}
기본 설명: {{summary}}
작성 목적: {{goal}}
원하는 분량: {{length}}
필수 포함 요소: {{include}}
피해야 할 표현: {{exclude}}

작성 원칙:
- 사실 요약 → 시장 반응 → 해석 → 체크 포인트 순으로 작성할 것
- 투자 권유나 확정적 표현은 피할 것
- 숫자와 지표가 있으면 초보자도 이해하기 쉽게 풀어 설명할 것
- 오늘 시장 분위기, 주요 지수 흐름, 왜 올랐는지/내렸는지, 핵심 뉴스 3~5개, 내일 체크 포인트를 포함할 것
- 제목 후보, 핵심 키워드, 검색 의도, 추천 소제목 구조, 본문, 메타 설명, 태그를 함께 정리할 것`,
  },
]
