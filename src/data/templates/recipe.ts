import type { PromptTemplate } from '../../types/prompt'

export const recipeTemplates: PromptTemplate[] = [
  {
    id: 'recipe-master',
    categoryId: 'recipe',
    name: '음식 레시피 정보글',
    description: '재료, 과정, 팁을 보기 좋게 정리하는 레시피형 프롬프트입니다.',
    fields: [
      { id: 'topic', label: '주제', type: 'text', required: true, placeholder: '예: 에어프라이어 군고구마 만드는 법' },
      {
        id: 'summary',
        label: '설명',
        type: 'textarea',
        defaultValue: '재료, 과정, 팁이 한눈에 들어오도록 정리',
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
        defaultValue: '재료, 과정, 소요 시간, 팁, 실패 줄이는 포인트',
      },
      {
        id: 'exclude',
        label: '피해야 할 표현',
        type: 'text',
        defaultValue: '과장된 맛 표현, 불필요한 장문, 애매한 계량',
      },
      {
        id: 'servings',
        label: '인분',
        type: 'text',
        defaultValue: '2인분 기준',
        placeholder: '예: 2인분',
      },
      {
        id: 'difficulty',
        label: '난이도',
        type: 'select',
        defaultValue: '초보도 가능한 쉬움',
        options: [
          { label: '초보도 가능한 쉬움', value: '초보도 가능한 쉬움' },
          { label: '보통', value: '보통' },
          { label: '조금 신경 써야 함', value: '조금 신경 써야 함' },
        ],
      },
      {
        id: 'cookTime',
        label: '조리시간',
        type: 'text',
        defaultValue: '30분 이내',
        placeholder: '예: 20분',
      },
      {
        id: 'recipeFocus',
        label: '재료/과정/팁 포함 여부',
        type: 'select',
        defaultValue: '모두 포함',
        options: [
          { label: '모두 포함', value: '모두 포함' },
          { label: '재료와 과정 중심', value: '재료와 과정 중심' },
          { label: '과정과 팁 중심', value: '과정과 팁 중심' },
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
인분: {{servings}}
난이도: {{difficulty}}
조리시간: {{cookTime}}
재료/과정/팁 포함 여부: {{recipeFocus}}

작성 기준:
- 도입 → 재료 요약 → 조리 과정 → 팁/주의사항 → 마무리 순으로 작성할 것
- 계량과 과정은 최대한 이해하기 쉽게 정리할 것
- 제목은 가장 어울리는 최종 제목 1개만 쓰고, 필요하면 이모지 1개 정도는 자연스럽게 사용할 수 있음

[출력 방식]
- 결과는 설명문 없이 블로그 본문과 이미지를 포함한 HTML 코드 중심으로 정리할 것
- 본문은 AI가 검토 가능한 HTML 코드로 작성할 것
- 마크다운 설명, 코드펜스, 추가 해설 없이 바로 쓸 수 있는 결과 중심으로 정리할 것
- html, head, body를 포함한 단일 HTML 문서 형태로 작성할 것
- title과 meta description을 포함할 것
- 본문은 article, section, h1, h2, p, ul, ol 중심으로 정리할 것
- 도입부, 본문, 마무리, FAQ 2~3개, 해시태그 10개, 연관 글 주제 3개를 HTML 안에 포함할 것
- 글과 이미지는 절대 한 장으로 합치지 말 것
- HTML 안에 썸네일 1장과 본문 이미지 1~2장을 각각 별도 img 태그로 넣을 것
- 각 이미지는 서로 다른 파일 또는 URL을 사용하고, 본문과 합성된 한 장 이미지처럼 만들지 말 것
- 각 이미지 아래에는 바로 내려받을 수 있는 a 링크를 함께 넣을 것
- 재료 사진, 중간 과정, 완성 사진이 각각 구분되게 배치할 것
- 전체 HTML은 한 파일로 저장해 열어봤을 때 블로그 초안처럼 자연스럽게 읽히는 구조여야 함

[HTML 포함 요소]
- 헤더 영역: 제목과 메타 설명 성격의 짧은 요약
- 썸네일 이미지 영역 1개
- 도입부
- 재료 요약 섹션
- 조리 과정 섹션
- 팁/주의사항 섹션
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
