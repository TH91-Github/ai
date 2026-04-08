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

[입력값]
카테고리: 역사
주제: {{topic}}
추가 설명: {{summary}}
원하는 분량: {{length}}
이미지 사용 기준: {{imagePolicy}}
필수 포함 내용: {{include}}
피해야 할 표현: {{exclude}}
시대: {{era}}
지역: {{region}}
서사 방식: {{storyStyle}}
참고 링크: {{referenceLinks}}

[카테고리별 생성 규칙: 역사]
- 사실을 바탕으로 역사 이야기를 재미있게 풀어주는 블로그 글을 작성할 것
- 역사 입문자도 이해할 수 있도록 어려운 배경은 쉽게 설명할 것
- 참고 링크가 입력되어 있다면 공공기관, 박물관, 사료 해설, 역사 자료, 영상 내용을 우선 참고해서 인물/연도/사건 흐름을 확인할 것
- 참고 링크가 여러 개라면 서로 다른 해석은 단정하지 말고, 확인 가능한 사실과 해석을 구분할 것
- 설민석 강사처럼 몰입감 있게 말하듯 풀되, 과장이나 확인되지 않은 이야기는 넣지 말 것
- 너무 교과서처럼 딱딱하게 쓰지 말고, 옆에서 이야기를 들려주듯 부드럽게 풀어갈 것
- 장면 전환이 필요한 곳에서는 "그런데 여기서 중요한 장면이 나옵니다", "바로 이 순간입니다!"처럼 자연스러운 말투를 사용할 수 있음
- 소제목은 문장형 또는 짧은 단어형으로 자유롭게 구성할 수 있음
- 필요하면 느낌표를 사용할 수 있지만, 사실을 과장하거나 감정적으로 몰아가지는 말 것
- "역사의 전환점", "그날의 거리", "사람들이 움직이기 시작한 순간"처럼 이야기를 시작하는 느낌의 표현을 활용할 수 있음
- 긴 역사 이야기를 그대로 늘어놓지 말고, 핵심 장면과 의미를 중심으로 짧고 선명하게 압축할 것
- 사건 소개 → 시대 배경 → 핵심 장면 → 흐름 변화 → 의미 → 오늘 기억할 포인트 순서로 구성할 것
- 연도와 사건은 단순 나열하지 말고 맥락 속에서 자연스럽게 설명할 것
- 인물 이름, 사건명, 지명은 사실 기반으로만 사용할 것
- "아마", "추정", "그랬을 것이다"처럼 추측성 표현은 피할 것
- 마지막에는 FAQ가 아니라 "핵심 요약"과 "오늘 기억할 포인트"로 정리할 것
- 이미지 프롬프트는 역사 주제에 맞게 시대 분위기, 장소, 지도, 기록 사진풍 이미지를 제안할 것
- 본문 이미지에는 도깨비를 넣지 말고, 역사적 배경 이해를 돕는 실사형/기록사진풍 이미지로 구성할 것
- 메타 설명, FAQ, 출처 목록은 만들지 말 것

위 조건을 모두 반영하여 실제로 저장 가능한 완성형 HTML 역사 블로그 결과물을 작성해주세요.`,
  },
]
