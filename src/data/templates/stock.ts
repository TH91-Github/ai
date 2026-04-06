import type { PromptTemplate } from '../../types/prompt'

export const stockTemplates: PromptTemplate[] = [
  {
    id: 'stock-master',
    categoryId: 'stock',
    name: '주식 요약 정보글',
    description: '시장 흐름과 핵심 뉴스, 체크 포인트를 신중하게 정리하는 프롬프트입니다.',
    fields: [
      { id: 'topic', label: '주제', type: 'text', required: true, placeholder: '예: 미국 증시 하루 요약' },
      {
        id: 'summary',
        label: '설명',
        type: 'textarea',
        defaultValue: '시장 분위기, 주요 지수 흐름, 핵심 뉴스와 체크 포인트를 초보자도 이해하기 쉽게 정리',
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
        defaultValue: '오늘 시장 분위기, 주요 지수, 핵심 뉴스 3~5개, 해석, 내일 체크 포인트',
      },
      {
        id: 'exclude',
        label: '피해야 할 표현',
        type: 'text',
        defaultValue: '투자 권유, 확정적 전망, 선동적 표현, 과장',
      },
      {
        id: 'riskProfile',
        label: '투자 성향',
        type: 'select',
        defaultValue: '중립적 정보 전달',
        options: [
          { label: '중립적 정보 전달', value: '중립적 정보 전달' },
          { label: '초보 투자자 관점', value: '초보 투자자 관점' },
        ],
      },
      {
        id: 'marketType',
        label: '시장',
        type: 'select',
        defaultValue: '미국 시장',
        options: [
          { label: '국내 시장', value: '국내 시장' },
          { label: '미국 시장', value: '미국 시장' },
        ],
      },
      {
        id: 'riskWarning',
        label: '리스크 경고 포함 여부',
        type: 'select',
        defaultValue: '포함',
        options: [
          { label: '포함', value: '포함' },
          { label: '간단히', value: '간단히' },
        ],
      },
    ],
    resultFormat: `당신은 한국어 정보형 블로그 전문 에디터이자 리서처입니다.

아래 정보를 바탕으로 티스토리에 바로 복붙 가능한 주식/시장 정보글을 작성해주세요.

주제: {{topic}}
설명: {{summary}}
원하는 분량: {{length}}
이미지 사용 여부: {{imagePolicy}}
필수 포함 내용: {{include}}
피해야 할 표현: {{exclude}}
투자 성향 기준: {{riskProfile}}
시장: {{marketType}}
리스크 경고 포함 여부: {{riskWarning}}

작성 기준:
- 사실 요약 → 시장 반응 → 해석 → 체크 포인트 순으로 작성할 것
- 최신 확인이 필요한 정보와 일반 설명 가능한 정보를 구분할 것
- 투자 유도, 과장, 확정적 표현은 피할 것
- 차트나 뉴스 캡처가 필요할 때만 2~3개 이내로 제안할 것

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
