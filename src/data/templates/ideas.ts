import type { PromptTemplate } from '../../types/prompt'

export const ideaTemplates: PromptTemplate[] = [
  {
    id: 'content-ideas',
    categoryId: 'ideas',
    name: '정보형 주제 추천',
    description: '검색 유입 가능성과 현실적인 경쟁도를 고려해 블로그 주제를 추천하는 템플릿입니다.',
    fields: [
      {
        id: 'topic',
        label: '블로그 방향',
        type: 'text',
        placeholder: '예: 개발 + 뉴스 + 생활 정보형 블로그',
      },
      {
        id: 'keywords',
        label: '관심 키워드',
        type: 'tags',
        placeholder: '예: React, ETF, 역사, 생활 팁, AI',
      },
      {
        id: 'summary',
        label: '설명',
        type: 'textarea',
        placeholder: '어떤 방향의 블로그인지, 어떤 독자를 생각하는지 적어주세요.',
      },
      {
        id: 'goal',
        label: '목적',
        type: 'text',
        placeholder: '예: 오늘 바로 쓸 만한 정보형 글 주제 추천 받기',
      },
      {
        id: 'length',
        label: '개수',
        type: 'text',
        placeholder: '예: 10개',
      },
      {
        id: 'include',
        label: '반영할 조건',
        type: 'tags',
        placeholder: '예: 검색 유입 가능성, 시즌성, 경쟁도, 초보자 관심사',
      },
      {
        id: 'exclude',
        label: '피해야 할 방향',
        type: 'tags',
        placeholder: '예: 경쟁 과열 키워드, 너무 포괄적인 주제, 광고성 주제',
      },
    ],
    resultFormat: `당신은 한국어 정보형 블로그 전문 콘텐츠 에디터이자 SEO 기반 콘텐츠 전략가다.

아래 정보를 바탕으로 정보형 블로그 주제 추천 프롬프트를 만들어줘.

블로그 방향: {{topic}}
관심 키워드: {{keywords}}
기본 설명: {{summary}}
목적: {{goal}}
원하는 개수: {{length}}
반영할 조건: {{include}}
피해야 할 방향: {{exclude}}

작성 원칙:
- 검색 유입 가능성, 시즌성/이슈성, 실제 궁금증을 기준으로 추천할 것
- 너무 경쟁이 심한 키워드보다 현실적으로 쓸 만한 주제를 우선 추천할 것
- 왜 추천하는지도 함께 설명할 것
- 개발 / 역사 / 주식 / 뉴스 / 생활정보 중에서 균형 있게 섞을 수 있으면 섞을 것
- 출력에는 추천 주제 목록, 추천 이유, 확장 가능한 연관 주제를 포함할 것`,
  },
]
