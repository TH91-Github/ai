import type { PromptTemplate } from '../../types/prompt'

export const historyTemplates: PromptTemplate[] = [
  {
    id: 'history-explainer',
    categoryId: 'history',
    name: '역사/시사 설명글',
    description: '사건 배경과 흐름, 의미를 쉽게 설명하는 정보형 글용 템플릿입니다.',
    fields: [
      {
        id: 'topic',
        label: '주제',
        type: 'text',
        placeholder: '예: 프랑스 혁명이 왜 일어났는가 / 냉전의 배경',
      },
      {
        id: 'keywords',
        label: '키워드',
        type: 'tags',
        placeholder: '예: 배경, 원인, 전개, 영향, 의미',
      },
      {
        id: 'summary',
        label: '설명',
        type: 'textarea',
        placeholder: '어떤 맥락으로 설명하고 싶은지 적어주세요.',
      },
      {
        id: 'goal',
        label: '목적',
        type: 'text',
        placeholder: '예: 초보자도 이해하기 쉬운 배경 설명 글',
      },
      {
        id: 'length',
        label: '분량',
        type: 'text',
        placeholder: '예: 1,500자 내외',
      },
      {
        id: 'include',
        label: '필수 포함 요소',
        type: 'tags',
        placeholder: '예: 사건 배경, 핵심 흐름, 의미, 영향',
      },
      {
        id: 'exclude',
        label: '피해야 할 표현',
        type: 'tags',
        placeholder: '예: 단순 연도 나열, 과장, 확인 안 된 해석',
      },
    ],
    resultFormat: `당신은 한국어 정보형 블로그 전문 콘텐츠 에디터다.

아래 주제로 역사/시사 설명형 블로그 글 작성용 프롬프트를 만들어줘.

주제: {{topic}}
핵심 키워드: {{keywords}}
기본 설명: {{summary}}
작성 목적: {{goal}}
원하는 분량: {{length}}
필수 포함 요소: {{include}}
피해야 할 표현: {{exclude}}

작성 원칙:
- 사건 소개 → 배경 → 핵심 흐름 → 의미/영향 순으로 설명할 것
- 단순 연도 나열보다 맥락 중심으로 정리할 것
- 초보자도 이해할 수 있게 쉽게 설명할 것
- 불확실한 해석은 사실처럼 단정하지 말 것
- 제목 후보, 핵심 키워드, 검색 의도, 소제목 구조, 본문, 메타 설명, 태그를 함께 정리할 것`,
  },
]
