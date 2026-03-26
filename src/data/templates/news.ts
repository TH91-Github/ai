import type { PromptTemplate } from '../../types/prompt'

export const newsTemplates: PromptTemplate[] = [
  {
    id: 'news-daily-summary',
    categoryId: 'news',
    name: '하루 뉴스 요약',
    description: '하루 종합 뉴스, 해외 이슈, 핵심 토픽 키워드를 정리하는 템플릿입니다.',
    fields: [
      {
        id: 'topic',
        label: '주제',
        type: 'text',
        placeholder: '예: 오늘 글로벌 뉴스 요약 / 미국 대선 관련 이슈',
      },
      {
        id: 'keywords',
        label: '키워드',
        type: 'tags',
        placeholder: '예: 해외 이슈, 경제, 정치, 기술, 토픽',
      },
      {
        id: 'summary',
        label: '설명',
        type: 'textarea',
        placeholder: '정리하고 싶은 뉴스 흐름이나 관점을 적어주세요.',
      },
      {
        id: 'goal',
        label: '목적',
        type: 'text',
        placeholder: '예: 하루 핵심 이슈를 쉽게 훑어보는 요약 글',
      },
      {
        id: 'length',
        label: '분량',
        type: 'text',
        placeholder: '예: 5개 토픽 기준 1,300자 내외',
      },
      {
        id: 'include',
        label: '필수 포함 요소',
        type: 'tags',
        placeholder: '예: 핵심 뉴스, 배경, 영향, 체크 포인트',
      },
      {
        id: 'exclude',
        label: '피해야 할 표현',
        type: 'tags',
        placeholder: '예: 자극적 표현, 확인 안 된 루머, 과장',
      },
    ],
    resultFormat: `당신은 한국어 정보형 블로그 전문 콘텐츠 에디터다.

아래 주제로 하루 뉴스 요약형 블로그 글 작성 프롬프트를 만들어줘.

주제: {{topic}}
핵심 키워드: {{keywords}}
기본 설명: {{summary}}
작성 목적: {{goal}}
원하는 분량: {{length}}
필수 포함 요소: {{include}}
피해야 할 표현: {{exclude}}

작성 원칙:
- 사실 확인이 어려운 내용은 단정하지 말 것
- 독자가 오늘 무슨 일이 있었는지 빠르게 이해하도록 핵심부터 설명할 것
- 하루 종합 뉴스, 해외 이슈, 핵심 토픽 키워드 정리에 맞는 구조로 작성할 것
- 제목 후보, 핵심 키워드, 검색 의도, 추천 소제목 구조, 본문, 메타 설명, 태그를 함께 정리할 것`,
  },
]
