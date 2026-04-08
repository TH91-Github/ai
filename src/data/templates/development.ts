import type { PromptTemplate } from '../../types/prompt'
import { blogHtmlOutputGuidelines } from './imageGuidelines'

export const developmentTemplates: PromptTemplate[] = [
  {
    id: 'development-master',
    categoryId: 'development',
    name: '개발 HTML 블로그',
    description: '개발 개념, 사용 목적, 코드 예제를 포함한 완성형 HTML 블로그 프롬프트입니다.',
    fields: [
      {
        id: 'topic',
        label: '주제',
        type: 'text',
        required: true,
        placeholder: '예: 웹소켓이란? / React PublicOnlyRoute란?',
      },
      {
        id: 'summary',
        label: '설명',
        type: 'textarea',
        defaultValue: '개념 설명과 사용 이유, 기본 예제, 실무 연결 포인트가 드러나는 글로 정리',
        placeholder: '예: 초보자도 이해할 수 있게 개념과 사용 흐름을 설명하고 싶음',
      },
      {
        id: 'length',
        label: '분량',
        type: 'text',
        defaultValue: '소제목 포함 완성형 글 1,100~1,400자 내외',
        placeholder: '예: 1,200자 내외',
      },
      {
        id: 'imagePolicy',
        label: '이미지 사용 여부',
        type: 'select',
        defaultValue: '이미지보다 코드와 설명 중심으로 작성',
        options: [
          { label: '코드와 설명 중심', value: '이미지보다 코드와 설명 중심으로 작성' },
          { label: '필요 시 이미지만', value: '필요한 경우에만 이미지 프롬프트 추가' },
        ],
      },
      {
        id: 'include',
        label: '필수 포함 내용',
        type: 'text',
        defaultValue: '개념 설명, 사용 목적, 간단한 사용 예시, 주석 포함 코드 예제, 주의사항',
        placeholder: '예: 개념 설명, 예제, 실무 팁',
      },
      {
        id: 'exclude',
        label: '피해야 할 표현',
        type: 'text',
        defaultValue: '과장 표현, 억지 SEO 문장, AI 티 나는 정리체',
        placeholder: '예: 무조건, 완벽하게 해결',
      },
      {
        id: 'audience',
        label: '대상 독자',
        type: 'select',
        defaultValue: '초보 개발자',
        options: [
          { label: '초보 개발자', value: '초보 개발자' },
          { label: '프론트엔드 입문자', value: '프론트엔드 입문자' },
          { label: '실무 개발자', value: '실무 개발자' },
        ],
      },
      {
        id: 'techStack',
        label: '사용 기술',
        type: 'text',
        defaultValue: 'JavaScript 또는 React 예시 기준',
        placeholder: '예: React, TypeScript',
      },
      {
        id: 'codeExample',
        label: '코드 예시 포함 여부',
        type: 'select',
        defaultValue: '포함',
        options: [
          { label: '포함', value: '포함' },
          { label: '생략', value: '생략' },
        ],
      },
      {
        id: 'referenceLinks',
        label: '참고 링크',
        type: 'textarea',
        placeholder: '예: 공식 문서, GitHub, MDN, 블로그 URL을 줄바꿈으로 입력',
        helperText: '입력한 링크가 있으면 개념과 예제를 판단하는 참고 자료로 활용합니다.',
      },
    ],
    resultFormat: `${blogHtmlOutputGuidelines}

이번 글은 개발 카테고리용입니다. 아래 조건을 자연스럽게 반영해서 실제 블로그에 바로 쓸 수 있는 완성형 HTML 결과물로 작성해주세요.

- 주제: {{topic}}
- 추가 설명: {{summary}}
- 원하는 분량: {{length}}
- 이미지 사용 기준: {{imagePolicy}}
- 꼭 포함할 내용: {{include}}
- 피해야 할 표현: {{exclude}}
- 대상 독자: {{audience}}
- 사용 기술: {{techStack}}
- 코드 예시 포함 여부: {{codeExample}}
- 참고 링크: {{referenceLinks}}

설명형 개발 블로그답게 개념 설명, 왜 쓰는지, 어디에 쓰는지, 간단한 사용 예시, 코드 예제, 주의사항, 마무리 흐름이 자연스럽게 이어지게 작성해주세요.
참고 링크가 있으면 공식 문서, MDN, GitHub, 기술 블로그 내용을 우선 참고하고 오래된 문법이나 deprecated API는 신중하게 구분해주세요.
코드 예제가 포함이면 주석을 넣고, 코드 블록은 읽기 편하게 정리해주세요.
개발 글에서는 본문 이미지를 억지로 넣지 말고 정말 필요할 때만 이미지 프롬프트를 포함해주세요.`,
  },
]
