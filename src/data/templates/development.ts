import type { PromptTemplate } from '../../types/prompt'

export const developmentTemplates: PromptTemplate[] = [
  {
    id: 'dev-feature-request',
    categoryId: 'development',
    name: '기능 구현 요청',
    description:
      '기술 스택과 구현 기준까지 함께 정리해서 개발 작업용 프롬프트 초안을 만드는 템플릿입니다.',
    fields: [
      {
        id: 'stack',
        label: '기술 조합',
        type: 'select',
        helperText: '많이 사용하는 기본 조합을 기준으로 선택할 수 있습니다.',
        options: [
          {
            label: 'React + Vite + TypeScript + Tailwind',
            value: 'React + Vite + TypeScript + Tailwind',
          },
          {
            label: 'HTML + CSS + JavaScript',
            value: 'HTML + CSS + JavaScript',
          },
          {
            label: 'Next.js + TypeScript + Tailwind',
            value: 'Next.js + TypeScript + Tailwind',
          },
          {
            label: 'React + TypeScript + CSS Modules',
            value: 'React + TypeScript + CSS Modules',
          },
        ],
      },
      {
        id: 'topic',
        label: '주제',
        type: 'text',
        placeholder: '예: 예약 시스템 관리자 페이지',
      },
      {
        id: 'keywords',
        label: '키워드',
        type: 'tags',
        placeholder: '예: 예약 목록, 상태 변경, 검색, 필터',
      },
      {
        id: 'summary',
        label: '설명',
        type: 'textarea',
        placeholder: '구현하려는 기능, 현재 상태, 원하는 방향을 적어주세요.',
      },
      {
        id: 'goal',
        label: '목적',
        type: 'text',
        placeholder: '예: 유지보수 가능한 MVP 기능 구현 요청서 정리',
      },
      {
        id: 'length',
        label: '분량',
        type: 'text',
        placeholder: '예: 구현 단계와 파일 구조가 보이는 10문장 내외',
      },
      {
        id: 'include',
        label: '필수 구현 요소',
        type: 'tags',
        placeholder: '예: 예외 처리, 타입 정의, 폴더 구조, 보안 체크',
      },
      {
        id: 'exclude',
        label: '피해야 할 구현',
        type: 'tags',
        placeholder: '예: 과한 라이브러리, 한 파일 몰아넣기, 민감정보 노출',
      },
    ],
    resultFormat: `다음 조건을 기준으로 개발 구현 프롬프트 초안을 한글로 작성해줘.

프로젝트 기본 스택: {{stack}}
주제: {{topic}}
핵심 키워드: {{keywords}}
배경 설명: {{summary}}
목적: {{goal}}
원하는 분량: {{length}}
필수 구현 요소: {{include}}
피해야 할 구현: {{exclude}}

아래 기본 구현 원칙을 기본 옵션으로 반드시 반영해줘.
- 기본 스택은 별도 요청이 없으면 React + Vite + TypeScript + Tailwind 기준으로 설명하고, 선택한 기술 조합이 있으면 그 기준에 맞춰 구조를 조정할 것
- 사람들이 많이 사용하는 조합을 기준으로 실무형 구조를 제안할 것
- 보안, 비용 감소, 최적화를 항상 고려할 것
- 기능과 목적에 맞게 컴포넌트, 훅, 유틸, 타입, API 레이어를 분리하고 한 파일이 과도하게 길어지지 않게 구성할 것
- 유지보수하기 쉽도록 폴더 구조와 책임을 명확히 나눌 것
- 포인트 색상은 변수로 관리하고 일반 CSS를 쓰는 경우에는 CSS 변수 var() 기준으로 관리할 것
- 예외 처리는 try catch finally를 가능한 범위에서 명확히 처리하고, 사용자 안내 문구와 함께 5초 후 이동하는 예외 페이지 흐름도 고려할 것
- 보안상 외부 공격을 100% 막을 수 없더라도 API 키, 민감 정보, 비밀값이 클라이언트에 노출되지 않도록 항상 주의할 것
- 필요 이상으로 무거운 라이브러리는 피하고, 초기 MVP에 맞는 단순하고 확장 가능한 구조를 유지할 것

결과는 아래 항목이 드러나게 정리해줘.
1. 구현 목표 요약
2. 추천 폴더 구조
3. 주요 컴포넌트와 훅 분리 기준
4. 예외 처리와 보안 고려사항
5. 실제 구현 요청 문장 초안`,
  },
]
