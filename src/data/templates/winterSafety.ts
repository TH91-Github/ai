import type { PromptTemplate } from '../../types/prompt'

export const winterSafetyTemplates: PromptTemplate[] = [
  {
    id: 'winter-safety-master',
    categoryId: 'winter-safety',
    name: '겨울철 조심 정보글',
    description: '겨울철 상황별 체크 포인트를 쉽게 정리하는 안전 정보 프롬프트입니다.',
    fields: [
      { id: 'topic', label: '주제', type: 'text', required: true, placeholder: '예: 겨울철 운전할 때 조심할 점' },
      {
        id: 'summary',
        label: '설명',
        type: 'textarea',
        defaultValue: '겨울철 사고나 건강 문제를 줄이기 위한 실용 정보 중심으로 정리',
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
        defaultValue: '상황 설명, 핵심 위험 요소, 체크리스트, 예방 팁',
      },
      {
        id: 'exclude',
        label: '피해야 할 표현',
        type: 'text',
        defaultValue: '공포 조장, 과장 표현, 불필요한 장문',
      },
      {
        id: 'situation',
        label: '대상 상황',
        type: 'select',
        defaultValue: '운전',
        options: [
          { label: '운전', value: '운전' },
          { label: '건강', value: '건강' },
          { label: '가정', value: '가정' },
        ],
      },
      {
        id: 'checklist',
        label: '체크리스트 포함 여부',
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
대상 상황: {{situation}}
체크리스트 포함 여부: {{checklist}}

작성 기준:
- 상황 설명 → 핵심 위험 요소 → 체크리스트 → 예방 팁 순으로 작성할 것
- 실생활에서 바로 적용 가능한 구조로 정리할 것
- 필요하면 체크리스트를 소제목 안에 자연스럽게 녹일 것
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
- 체크리스트, 상황별 주의 장면, 대표 이미지가 각각 구분되게 배치할 것
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
