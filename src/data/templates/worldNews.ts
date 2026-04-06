import type { PromptTemplate } from '../../types/prompt'

export const worldNewsTemplates: PromptTemplate[] = [
  {
    id: 'world-news-master',
    categoryId: 'world-news',
    name: '세계뉴스 요약 정보글',
    description: '해외 이슈와 국제 뉴스 흐름을 이해하기 쉽게 정리하는 프롬프트입니다.',
    fields: [
      { id: 'topic', label: '주제', type: 'text', required: true, placeholder: '예: 오늘 세계 경제 뉴스 요약' },
      {
        id: 'summary',
        label: '설명',
        type: 'textarea',
        defaultValue: '핵심 뉴스와 배경, 영향, 체크 포인트를 중립적으로 정리',
      },
      {
        id: 'length',
        label: '분량',
        type: 'text',
        defaultValue: '소제목 포함 완성형 글 900~1,200자 내외',
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
        defaultValue: '핵심 이슈, 배경, 시장 또는 사회적 영향, 체크 포인트',
      },
      {
        id: 'exclude',
        label: '피해야 할 표현',
        type: 'text',
        defaultValue: '자극적 제목, 확정적 해석, 루머성 내용',
      },
      {
        id: 'region',
        label: '지역',
        type: 'text',
        defaultValue: '미국, 유럽, 아시아 등 주요 지역 중심',
        placeholder: '예: 미국, 유럽',
      },
      {
        id: 'timeframe',
        label: '시점',
        type: 'text',
        defaultValue: '오늘 또는 최근 24시간 기준',
        placeholder: '예: 오늘, 이번 주',
      },
      {
        id: 'neutralTone',
        label: '중립적 톤 여부',
        type: 'select',
        defaultValue: '중립적으로 작성',
        options: [
          { label: '중립적으로 작성', value: '중립적으로 작성' },
          { label: '설명형으로만 작성', value: '설명형으로만 작성' },
        ],
      },
    ],
    resultFormat: `당신은 한국어 정보형 블로그 전문 에디터이자 리서처입니다.

아래 정보를 바탕으로 티스토리에 바로 복붙 가능한 세계뉴스 요약 정보글을 작성해주세요.

주제: {{topic}}
설명: {{summary}}
원하는 분량: {{length}}
이미지 사용 여부: {{imagePolicy}}
필수 포함 내용: {{include}}
피해야 할 표현: {{exclude}}
지역: {{region}}
시점: {{timeframe}}
중립적 톤 여부: {{neutralTone}}

작성 기준:
- 최신 확인이 필요한 내용과 일반 설명 가능한 내용을 구분할 것
- 사실 요약을 먼저 제시하고, 해석은 신중하게 덧붙일 것
- 뉴스 캡처, 지도, 차트가 필요한 경우에만 제안할 것
- 제목 후보와 최종 제목은 필요하면 이모지를 1개 정도 자연스럽게 사용할 수 있음
- 결과는 복사-붙여넣기 편하게 문단과 소제목을 정리할 것
- 제목 후보는 가장 어울리는 순서대로 3개만 제안할 것
- 설명형 이해를 돕는 데 필요하면 이미지 제안을 포함할 것

출력 형식:
1. 제목 후보 3개
2. 최종 추천 제목 1개
3. 메타 설명 1개
4. 도입부
5. 본문 (소제목 포함 완성형)
6. 필요 시 이미지 추천 위치
7. 마무리
8. FAQ 2~3개
9. 해시태그 10개
10. 함께 쓰기 좋은 연관 글 주제 3개

중요:
- 복사 후 바로 붙여넣어도 구조가 깨지지 않게 정리할 것`,
  },
]
