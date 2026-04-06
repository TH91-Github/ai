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

아래 정보를 바탕으로 티스토리에 바로 복붙 가능한 겨울철 조심 정보글을 작성해주세요.

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
