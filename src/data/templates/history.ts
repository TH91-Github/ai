import type { PromptTemplate } from '../../types/prompt'
import { blogHtmlOutputGuidelines } from './imageGuidelines'

export const historyTemplates: PromptTemplate[] = [
  {
    id: 'history-master',
    categoryId: 'history',
    name: '역사 이야기 HTML 블로그',
    description: '사실을 바탕으로 역사 이야기를 재미있게 풀고 핵심 포인트를 짧게 정리하는 프롬프트입니다.',
    fields: [
      {
        id: 'topic',
        label: '주제',
        type: 'text',
        required: true,
        placeholder: '예: 3.1절 독립운동 / 프랑스 혁명 / 임진왜란의 흐름',
      },
      {
        id: 'summary',
        label: '설명',
        type: 'textarea',
        defaultValue: '사실을 바탕으로 역사적 배경과 핵심 흐름을 재미있고 쉽게 풀어 설명',
        placeholder: '예: 3.1절을 역사 입문자도 이해하기 쉽게 이야기처럼 정리',
      },
      {
        id: 'length',
        label: '분량',
        type: 'text',
        defaultValue: '소제목 포함 완성형 글 1,200~1,600자 내외',
      },
      {
        id: 'imagePolicy',
        label: '이미지 사용 여부',
        type: 'select',
        defaultValue: '썸네일과 본문 이미지 프롬프트 제공',
        options: [
          { label: '이미지 프롬프트 포함', value: '썸네일과 본문 이미지 프롬프트 제공' },
          { label: '이미지 최소화', value: '이미지는 최소화하고 필요한 프롬프트만 제공' },
        ],
      },
      {
        id: 'include',
        label: '필수 포함 내용',
        type: 'text',
        defaultValue: '시대 배경, 핵심 사건, 주요 인물, 사건 흐름, 오늘 기억할 포인트',
      },
      {
        id: 'exclude',
        label: '피해야 할 표현',
        type: 'text',
        defaultValue: '추측성 표현, 확인되지 않은 해석, 과장, 단순 연도 나열',
      },
      {
        id: 'era',
        label: '시대',
        type: 'text',
        defaultValue: '관련 시대 배경을 함께 설명',
        placeholder: '예: 1919년 일제강점기',
      },
      {
        id: 'region',
        label: '지역',
        type: 'text',
        defaultValue: '사건이 발생한 주요 지역 중심',
        placeholder: '예: 서울 탑골공원, 한반도',
      },
      {
        id: 'storyStyle',
        label: '서사 방식',
        type: 'select',
        defaultValue: '부드러운 이야기형 설명',
        options: [
          { label: '부드러운 이야기형 설명', value: '부드러운 이야기형 설명' },
          { label: '재미있는 강의형 설명', value: '재미있는 강의형 설명' },
          { label: '현장감 있는 이야기형', value: '현장감 있는 이야기형' },
          { label: '입문자용 쉬운 해설', value: '입문자용 쉬운 해설' },
        ],
      },
      {
        id: 'referenceLinks',
        label: '참고 링크',
        type: 'textarea',
        placeholder: '예: 위키/공공기관/박물관/역사 자료/영상 URL을 줄바꿈으로 입력',
        helperText: '입력한 링크가 있으면 사건 흐름과 인물 정보를 사실 확인용으로 참고합니다.',
      },
    ],
    resultFormat: `${blogHtmlOutputGuidelines}

이번 글은 역사 카테고리용입니다. 아래 조건을 반영해서 실제 블로그에 바로 쓸 수 있는 완성형 HTML 역사 글로 작성해주세요.

- 주제: {{topic}}
- 추가 설명: {{summary}}
- 원하는 분량: {{length}}
- 이미지 사용 기준: {{imagePolicy}}
- 꼭 포함할 내용: {{include}}
- 피해야 할 표현: {{exclude}}
- 시대: {{era}}
- 지역: {{region}}
- 서사 방식: {{storyStyle}}
- 참고 링크: {{referenceLinks}}

사실을 바탕으로 하되, 역사 입문자도 이해하기 쉽게 부드러운 이야기형으로 풀어주세요.
참고 링크가 있으면 공공기관, 박물관, 사료 해설, 역사 자료, 영상 내용을 우선 참고해서 인물, 연도, 사건 흐름을 확인해주세요.
과장이나 확인되지 않은 이야기는 넣지 말고, 긴 이야기를 그대로 늘어놓기보다 핵심 장면과 의미 중심으로 압축해주세요.
사건 소개, 시대 배경, 핵심 장면, 흐름 변화, 의미, 오늘 기억할 포인트가 자연스럽게 이어지게 구성해주세요.
"아마", "추정", "그랬을 것이다" 같은 추측성 표현은 피해주세요.`,
  },
]
