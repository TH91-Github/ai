import type { PromptTemplate } from '../../types/prompt'

export const blogTemplates: PromptTemplate[] = [
  {
    id: 'blog-review-draft',
    categoryId: 'blog',
    name: '후기/정보형 글 초안',
    description: '블로그용 후기형 또는 정보형 글 구조를 잡아주는 초안입니다.',
    fields: [
      { id: 'topic', label: '주제', type: 'text', placeholder: '예: 제주도 2박 3일 가족여행 후기' },
      { id: 'keywords', label: '키워드', type: 'tags', placeholder: '예: 여행 코스, 맛집, 숙소, 팁' },
      { id: 'summary', label: '설명', type: 'textarea', placeholder: '글에 담고 싶은 경험이나 정보를 적어주세요.' },
      { id: 'goal', label: '목적', type: 'text', placeholder: '예: 검색 유입용 정보성 글 초안' },
      { id: 'length', label: '분량', type: 'text', placeholder: '예: 소제목 포함 1,500자 내외' },
      {
        id: 'include',
        label: '필수 구성 요소',
        type: 'tags',
        placeholder: '예: 제목 방향, 도입부, 소제목, 핵심 팁, 마무리',
      },
      {
        id: 'exclude',
        label: '피해야 할 표현',
        type: 'tags',
        placeholder: '예: 과장 표현, 광고 느낌, 중복 문장, 뻔한 마무리',
      },
    ],
    resultFormat: `다음 정보를 바탕으로 블로그 글 초안 프롬프트를 만들어줘.

주제: {{topic}}
핵심 키워드: {{keywords}}
기본 설명: {{summary}}
작성 목적: {{goal}}
원하는 분량: {{length}}
필수 구성 요소: {{include}}
피해야 할 표현: {{exclude}}

결과는 사람이 검수하고 다듬기 쉬운 한글 초안 형태로, 제목 방향과 소제목 흐름이 드러나게 정리해줘.`,
  },
]
