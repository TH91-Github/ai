import type { PromptTemplate } from '../../types/prompt'

export const developmentTemplates: PromptTemplate[] = [
  {
    id: 'development-master',
    categoryId: 'development',
    name: '개발 설명형 정보글',
    description: '초보자도 이해하기 쉽게 개발 개념과 사용법을 정리하는 완성형 프롬프트입니다.',
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
        defaultValue: '이미지 없이 코드와 설명 중심으로 작성',
        options: [
          { label: '이미지 없이 진행', value: '이미지 없이 코드와 설명 중심으로 작성' },
          { label: '필요 시만 사용', value: '필요할 때만 이미지 사용' },
        ],
      },
      {
        id: 'include',
        label: '필수 포함 내용',
        type: 'text',
        defaultValue: '개념 설명, 왜 필요한지, 언제 쓰는지, 기본 사용법, 코드 예시, 주의사항, 관련 개념',
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
    ],
    resultFormat: `당신은 한국어 정보형 블로그 전문 에디터이자 리서처입니다.

아래 정보를 바탕으로 실제 블로그에 바로 활용할 수 있는 완성형 HTML 한 개를 작성해주세요.

[기본 작성 기준]
- 글 유형: 정보형 + 가이드형 + SEO형
- 기본 톤: 자연스럽고 읽기 쉬운 정보 전달형
- 광고처럼 과장하지 말 것
- AI가 쓴 티가 나지 않게 사람 손으로 정리한 느낌으로 쓸 것
- 초보자도 이해할 수 있게 설명할 것
- 너무 길지 않게, 끝까지 읽기 좋은 중간 길이로 작성할 것

[개발 글 추가 기준]
- 개념 설명 → 왜 필요한지 → 어디에 쓰는지 → 기본 사용법 → 코드 예시 → 주의사항 → 관련 개념 흐름으로 작성
- 주제와 관련 없는 개발 확장 설명은 넣지 말 것
- 실무에서 어떻게 연결되는지도 짧게 포함할 것
- 코드 예시 포함 여부: {{codeExample}}
- 사용 기술: {{techStack}}
- 대상 독자: {{audience}}

[입력 정보]
주제: {{topic}}
핵심 설명: {{summary}}
원하는 분량: {{length}}
이미지 사용 여부: {{imagePolicy}}
필수 포함 내용: {{include}}
피해야 할 표현: {{exclude}}

[출력 방식]
- 결과는 설명문 없이 블로그 본문과 필요 시 이미지를 포함한 HTML 코드 중심으로 정리할 것
- 본문은 AI가 검토 가능한 HTML 코드로 작성할 것
- 마크다운 설명, 코드펜스, 추가 해설 없이 바로 쓸 수 있는 결과 중심으로 정리할 것
- html, head, body를 포함한 단일 HTML 문서 형태로 작성할 것
- title과 meta description을 포함할 것
- 본문은 복붙하기 쉽도록 article, section, h1, h2, p, ul 구조로 정리할 것
- 제목은 가장 어울리는 최종 제목 1개만 h1에 넣고, 필요하면 이모지 1개 정도는 자연스럽게 사용할 수 있음
- FAQ 2~3개와 해시태그 10개, 함께 쓰기 좋은 연관 글 주제 3개도 HTML 안에 포함할 것
- 코드 예시가 포함일 때만 pre, code 블록을 넣을 것
- 개발 글은 이미지가 꼭 필요하지 않으면 이미지 섹션을 만들지 말 것
- 글과 이미지는 절대 한 장으로 합치지 말 것
- 이미지는 기본적으로 생략하되, 정말 필요한 경우에만 썸네일 1장 또는 본문 보조 이미지 1장 정도를 img 태그로 따로 넣을 것
- 이미지를 넣는 경우 각 이미지 아래에는 바로 내려받을 수 있는 a 링크를 함께 넣을 것
- 전체 HTML은 한 파일로 저장해 열어봤을 때 블로그 초안처럼 자연스럽게 읽히는 구조여야 함

[HTML 포함 요소]
- 헤더 영역: 제목, 메타 설명 성격의 짧은 소개
- 도입부
- 소제목이 있는 본문 3~4개 섹션
- 필요 시 코드 예시 섹션
- 마무리
- FAQ 섹션
- 해시태그 섹션
- 연관 글 주제 섹션

중요:
- 결과는 아래 순서로 정리할 것
1. 최종 제목 1개
2. 메타 설명 1개
3. 블로그 본문과 필요 시 이미지가 포함된 HTML 전체 코드 1개
4. 사용한 이미지가 있으면 이미지 설명
- 복사 후 파일로 저장하거나 일부만 복붙해도 구조를 파악하기 쉬워야 할 것`,
  },
]
