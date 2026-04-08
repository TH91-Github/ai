import type { PromptTemplate } from '../../types/prompt'
import { blogHtmlOutputGuidelines } from './imageGuidelines'

export const recipeTemplates: PromptTemplate[] = [
  {
    id: 'recipe-master',
    categoryId: 'recipe',
    name: '음식 레시피 HTML 블로그',
    description: '재료, 과정, 차이점, 보완 팁을 블로그형 HTML로 정리하는 레시피 프롬프트입니다.',
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
        defaultValue: '썸네일과 본문 이미지 프롬프트 제공',
        options: [
          { label: '필요할 때만 사용', value: '썸네일과 본문 이미지 프롬프트 제공' },
          { label: '이미지 없이 진행', value: '이미지 없이 텍스트 중심으로 작성' },
        ],
      },
      {
        id: 'include',
        label: '필수 포함 내용',
        type: 'text',
        defaultValue: '공통 재료, 레시피별 조리 방법, 차이점 분석, 맛 보완 팁',
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
      {
        id: 'referenceLinks',
        label: '참고 링크',
        type: 'textarea',
        placeholder: '예: 참고 레시피, 유튜브 요리 영상, 제품 페이지 URL을 줄바꿈으로 입력',
        helperText: '입력한 링크가 있으면 재료와 조리 흐름을 참고하되 그대로 베끼지 않습니다.',
      },
    ],
    resultFormat: `${blogHtmlOutputGuidelines}

이번 글은 음식 레시피 카테고리용입니다. 아래 조건을 반영해서 실제 블로그에 바로 쓸 수 있는 완성형 HTML 레시피 글로 작성해주세요.

- 주제: {{topic}}
- 추가 설명: {{summary}}
- 원하는 분량: {{length}}
- 이미지 사용 기준: {{imagePolicy}}
- 꼭 포함할 내용: {{include}}
- 피해야 할 표현: {{exclude}}
- 인분: {{servings}}
- 난이도: {{difficulty}}
- 조리시간: {{cookTime}}
- 재료/과정/팁 포함 여부: {{recipeFocus}}
- 참고 링크: {{referenceLinks}}

하나의 메뉴를 기준으로 공통 재료, 조리 방법, 차이점, 맛 보완 팁이 자연스럽게 이어지게 정리해주세요.
참고 링크가 있으면 재료, 조리 순서, 시간, 온도, 영상 흐름을 참고하되 문장을 그대로 베끼지 말고 블로그용으로 자연스럽게 다시 써주세요.
계량과 과정은 최대한 이해하기 쉽게 정리하고, 실제 요리 블로그처럼 따라 하기 편한 흐름으로 구성해주세요.`,
  },
]
