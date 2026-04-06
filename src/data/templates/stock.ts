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

아래 정보를 바탕으로 실제 블로그에 바로 활용할 수 있는 완성형 HTML 한 개를 작성해주세요.

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
- 제목은 가장 어울리는 최종 제목 1개만 쓰고, 필요하면 이모지 1개 정도는 자연스럽게 사용할 수 있음

[출력 방식]
- 결과는 설명문 없이 블로그 본문과 이미지를 포함한 HTML 코드 중심으로 정리할 것
- 본문은 AI가 검토 가능한 HTML 코드로 작성할 것
- 마크다운 설명, 코드펜스, 추가 해설 없이 바로 쓸 수 있는 결과 중심으로 정리할 것
- html, head, body를 포함한 단일 HTML 문서 형태로 작성할 것
- title과 meta description을 포함할 것
- 본문은 article, section, h1, h2, p, ul 중심으로 정리할 것
- 도입부, 본문, 마무리, FAQ 2~3개, 해시태그 10개, 연관 글 주제 3개를 HTML 안에 포함할 것
- 글과 이미지는 절대 한 장으로 합치지 말 것
- HTML 안에 썸네일 1장과 본문 이미지 1~2장을 각각 별도 img 태그로 넣을 것
- 각 이미지는 서로 다른 파일 또는 URL을 사용하고, 본문과 합성된 한 장 이미지처럼 만들지 말 것
- 각 이미지 아래에는 바로 내려받을 수 있는 a 링크를 함께 넣을 것
- 차트, 대표 이미지, 뉴스 요약 이미지가 각각 구분되게 배치할 것
- 리스크 경고가 포함이면 본문 또는 마무리에 신중한 투자 유의 문장을 자연스럽게 넣을 것
- 전체 HTML은 한 파일로 저장해 열어봤을 때 블로그 초안처럼 자연스럽게 읽히는 구조여야 함

[HTML 포함 요소]
- 헤더 영역: 제목과 메타 설명 성격의 짧은 요약
- 썸네일 이미지 영역 1개
- 도입부
- 소제목이 있는 본문 3~4개 섹션
- 본문 중간 이미지 영역 1~2개
- 마무리
- FAQ 섹션
- 해시태그 섹션
- 연관 글 주제 섹션

중요:
- 결과는 아래 순서로 정리할 것
1. 최종 제목 1개
2. 메타 설명 1개
3. 블로그 본문과 이미지가 포함된 HTML 전체 코드 1개
4. 사용한 이미지 목록 또는 이미지 설명
- 복사 후 파일로 저장하거나 일부만 복붙해도 구조를 파악하기 쉬워야 할 것`,
  },
]
