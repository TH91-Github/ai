import type { PromptTemplate } from '../../types/prompt'

export const worldNewsTemplates: PromptTemplate[] = [
  {
    id: 'world-news-master',
    categoryId: 'world-news',
    name: '세계뉴스 요약 정보글',
    description: '티스토리에 바로 쓰기 좋은 세계뉴스 실전형 요약 프롬프트입니다.',
    fields: [
      { id: 'topic', label: '주제', type: 'text', required: true, placeholder: '예: 오늘 세계 경제 뉴스 요약' },
      {
        id: 'summary',
        label: '설명',
        type: 'textarea',
        defaultValue: '가장 큰 이슈를 메인으로, 관련 서브 이슈까지 함께 정리',
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
        defaultValue: '필요 시 블로그용 이미지 추천과 프롬프트도 함께 제안',
        options: [
          {
            label: '필요 시 이미지 추천 포함',
            value: '필요 시 블로그용 이미지 추천과 프롬프트도 함께 제안',
          },
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
        defaultValue: '사실 중심, 중립적 톤으로 정리',
        options: [
          { label: '사실 중심, 중립적 톤', value: '사실 중심, 중립적 톤으로 정리' },
          { label: '설명형 위주', value: '설명형 위주로 정리' },
        ],
      },
    ],
    resultFormat: `당신은 한국어 정보형 블로그 전문 에디터이자 리서처입니다.

아래 주제를 바탕으로 티스토리에 바로 복붙 가능한 세계뉴스 요약 글을 작성해주세요.

주제: {{topic}}
기준 시점: {{timeframe}}
중심 방향: {{summary}}
원하는 분량: {{length}}
이미지 사용 여부: {{imagePolicy}}
필수 포함 내용: {{include}}
피해야 할 표현: {{exclude}}
지역: {{region}}
작성 톤: {{neutralTone}}

작성 기준:
- 사실 중심, 중립적 톤으로 정리할 것
- 핵심 뉴스 → 배경 → 영향 → 체크 포인트 흐름으로 구성할 것
- 미국, 유럽, 아시아 등 주요 지역 흐름을 함께 반영할 것
- 최신 이슈는 사실 확인 기반으로, 배경 설명은 쉽게 풀어서 작성할 것
- 자극적 표현, 확정적 해석, 루머성 내용은 제외할 것
- 티스토리 복붙이 편하도록 문단과 소제목을 깔끔하게 정리할 것
- 제목 후보와 최종 제목은 필요하면 이모지를 1개 정도 자연스럽게 사용할 수 있음
- 결과는 복사-붙여넣기 편하게 문단과 소제목을 정리할 것
- 제목 후보는 가장 어울리는 순서대로 3개만 제안할 것
- 필요 시 블로그용 이미지 위치, 썸네일 문구, 이미지 프롬프트도 함께 제안할 것

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
11. 썸네일 문구 2~3개

중요:
- 복사 후 바로 붙여넣어도 구조가 깨지지 않게 정리할 것`,
  },
]
