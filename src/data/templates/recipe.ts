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

아래 정보를 바탕으로 티스토리에 바로 복붙 가능한 음식 레시피 정보글을 작성해주세요.

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
- 이미지가 필요하면 재료 사진, 중간 과정, 완성 사진 정도로만 제안할 것

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
