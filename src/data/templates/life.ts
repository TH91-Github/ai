import type { PromptTemplate } from '../../types/prompt'

export const lifeTemplates: PromptTemplate[] = [
  {
    id: 'life-guide',
    categoryId: 'life',
    name: '생활 정보 가이드',
    description: '실용 팁, 서비스 이용법, 제도 설명에 맞춘 정보형 글 템플릿입니다.',
    fields: [
      {
        id: 'topic',
        label: '주제',
        type: 'text',
        placeholder: '예: 실업급여 신청 방법 / 모바일 신분증 발급 방법',
      },
      {
        id: 'keywords',
        label: '키워드',
        type: 'tags',
        placeholder: '예: 신청 방법, 준비물, 절차, 주의사항',
      },
      {
        id: 'summary',
        label: '설명',
        type: 'textarea',
        placeholder: '설명하고 싶은 서비스나 상황을 적어주세요.',
      },
      {
        id: 'goal',
        label: '목적',
        type: 'text',
        placeholder: '예: 바로 따라할 수 있는 생활 정보 정리',
      },
      {
        id: 'length',
        label: '분량',
        type: 'text',
        placeholder: '예: 절차 중심 1,500자 내외',
      },
      {
        id: 'include',
        label: '필수 포함 요소',
        type: 'tags',
        placeholder: '예: 핵심 요약, 절차, 준비물, 주의사항, 팁',
      },
      {
        id: 'exclude',
        label: '피해야 할 표현',
        type: 'tags',
        placeholder: '예: 불필요한 장문, 단정적 표현, 애매한 설명',
      },
    ],
    resultFormat: `당신은 한국어 정보형 블로그 전문 콘텐츠 에디터다.

아래 주제로 생활 정보형 블로그 글 작성 프롬프트를 만들어줘.

주제: {{topic}}
핵심 키워드: {{keywords}}
기본 설명: {{summary}}
작성 목적: {{goal}}
원하는 분량: {{length}}
필수 포함 요소: {{include}}
피해야 할 표현: {{exclude}}

작성 원칙:
- 상황 설명 → 핵심 요약 → 방법/절차 → 주의사항 → 팁 순으로 작성할 것
- 실생활에서 바로 도움되는 구조로 정리할 것
- 초보자도 따라하기 쉽게 설명할 것
- 제목 후보, 핵심 키워드, 검색 의도, 추천 소제목 구조, 본문, 메타 설명, 태그를 함께 정리할 것`,
  },
]
