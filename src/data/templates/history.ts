import type { PromptTemplate } from '../../types/prompt'

export const historyTemplates: PromptTemplate[] = [
  {
    id: 'history-master',
    categoryId: 'history',
    name: '역사 설명형 정보글',
    description: '사건의 배경과 흐름, 의미를 쉽게 풀어쓰는 역사 정보글 프롬프트입니다.',
    fields: [
      { id: 'topic', label: '주제', type: 'text', required: true, placeholder: '예: 프랑스 혁명은 왜 일어났을까?' },
      {
        id: 'summary',
        label: '설명',
        type: 'textarea',
        defaultValue: '배경과 흐름, 의미를 초보자도 이해하기 쉽게 정리',
      },
      {
        id: 'length',
        label: '분량',
        type: 'text',
        defaultValue: '소제목 포함 완성형 글 1,100~1,400자 내외',
      },
      {
        id: 'imagePolicy',
        label: '이미지 사용 여부',
        type: 'select',
        defaultValue: '필요할 때만 이미지 사용',
        options: [
          { label: '필요할 때만 사용', value: '필요할 때만 이미지 사용' },
          { label: '이미지 없이 진행', value: '이미지 없이 텍스트 중심으로 작성' },
        ],
      },
      {
        id: 'include',
        label: '필수 포함 내용',
        type: 'text',
        defaultValue: '사건 소개, 배경, 핵심 흐름, 의미와 영향',
      },
      {
        id: 'exclude',
        label: '피해야 할 표현',
        type: 'text',
        defaultValue: '단순 연도 나열, 과장, 확인되지 않은 해석',
      },
      {
        id: 'era',
        label: '시대',
        type: 'text',
        defaultValue: '관련 시대 배경을 함께 설명',
        placeholder: '예: 근대 유럽',
      },
      {
        id: 'region',
        label: '지역',
        type: 'text',
        defaultValue: '사건이 발생한 주요 지역 중심',
        placeholder: '예: 프랑스, 유럽',
      },
      {
        id: 'backgroundNeeded',
        label: '사건 배경 설명 여부',
        type: 'select',
        defaultValue: '포함',
        options: [
          { label: '포함', value: '포함' },
          { label: '간단히만', value: '간단히만' },
        ],
      },
    ],
    resultFormat: `당신은 한국어 정보형 블로그 전문 에디터이자 리서처입니다.

아래 정보를 바탕으로 티스토리에 바로 복붙 가능한 역사 설명형 정보글을 작성해주세요.

주제: {{topic}}
설명: {{summary}}
원하는 분량: {{length}}
이미지 사용 여부: {{imagePolicy}}
필수 포함 내용: {{include}}
피해야 할 표현: {{exclude}}
시대: {{era}}
지역: {{region}}
사건 배경 설명 여부: {{backgroundNeeded}}

작성 기준:
- 사건 소개 → 배경 → 핵심 흐름 → 의미/영향 순으로 작성할 것
- 단순 연도 나열보다 맥락을 중심으로 설명할 것
- 독자가 왜 중요한지 이해할 수 있게 정리할 것
- 이미지가 필요하면 실제 사진, 지도, 도표 위주로 2~3개만 제안할 것

출력 형식:
1. 제목 후보 5개
2. 최종 추천 제목 1개
3. 메타 설명 1개
4. 도입부
5. 본문 (소제목 포함 완성형)
6. 필요 시 이미지 추천 위치
7. 마무리
8. FAQ 2~3개
9. 해시태그 10개
10. 함께 쓰기 좋은 연관 글 주제 3개`,
  },
]
