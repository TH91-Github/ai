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

아래 정보를 바탕으로 티스토리에 바로 복붙 가능한 건강 정보 가이드를 작성해주세요.

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
- 이미지가 필요하면 생활 장면, 체크리스트, 절차 이미지 위주로 제안할 것

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
