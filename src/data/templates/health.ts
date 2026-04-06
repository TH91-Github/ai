import type { PromptTemplate } from '../../types/prompt'

export const healthTemplates: PromptTemplate[] = [
  {
    id: 'health-master',
    categoryId: 'health',
    name: '건강 정보 가이드',
    description: '생활 건강 정보와 주의사항을 읽기 쉽게 정리하는 프롬프트입니다.',
    fields: [
      { id: 'topic', label: '주제', type: 'text', required: true, placeholder: '예: 봄철 알레르기 대처법' },
      {
        id: 'summary',
        label: '설명',
        type: 'textarea',
        defaultValue: '초보자도 이해하기 쉽게 건강 정보와 주의사항을 정리',
      },
      {
        id: 'length',
        label: '분량',
        type: 'text',
        defaultValue: '소제목 포함 완성형 글 1,000~1,300자 내외',
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
        defaultValue: '핵심 요약, 주의사항, 일상 팁, 확인이 필요한 경우 전문가 상담 권고',
      },
      {
        id: 'exclude',
        label: '피해야 할 표현',
        type: 'text',
        defaultValue: '단정적 치료 표현, 과장, 검증되지 않은 민간요법',
      },
      {
        id: 'ageGroup',
        label: '대상 연령대',
        type: 'select',
        defaultValue: '성인 일반',
        options: [
          { label: '성인 일반', value: '성인 일반' },
          { label: '어린이/보호자', value: '어린이/보호자' },
          { label: '중장년층', value: '중장년층' },
        ],
      },
      {
        id: 'cautionLevel',
        label: '주의사항 강조',
        type: 'select',
        defaultValue: '포함',
        options: [
          { label: '포함', value: '포함' },
          { label: '간단히', value: '간단히' },
        ],
      },
      {
        id: 'expertAdvice',
        label: '전문가 상담 유도 문구 포함 여부',
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

주제: {{topic}}
설명: {{summary}}
원하는 분량: {{length}}
이미지 사용 여부: {{imagePolicy}}
필수 포함 내용: {{include}}
피해야 할 표현: {{exclude}}
대상 연령대: {{ageGroup}}
주의사항 강조: {{cautionLevel}}
전문가 상담 유도 문구 포함 여부: {{expertAdvice}}

작성 기준:
- 상황 설명 → 핵심 요약 → 방법/생활 팁 → 주의사항 → 마무리 순으로 작성할 것
- 건강 정보는 단정적으로 진단하지 말 것
- 필요한 경우 전문가 상담이 필요할 수 있다는 점을 자연스럽게 반영할 것
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
- 생활 장면, 체크리스트, 절차 설명 이미지가 각각 구분되게 배치할 것
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
