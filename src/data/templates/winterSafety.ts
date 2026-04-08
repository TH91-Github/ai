import type { PromptTemplate } from '../../types/prompt'
import { blogHtmlOutputGuidelines } from './imageGuidelines'

export const winterSafetyTemplates: PromptTemplate[] = [
  {
    id: 'winter-safety-master',
    categoryId: 'winter-safety',
    name: '기타 HTML 블로그',
    description: '분류가 애매한 주제도 정보형 블로그 HTML로 정리하는 범용 프롬프트입니다.',
    fields: [
      { id: 'topic', label: '주제', type: 'text', required: true, placeholder: '예: 앱 추천 / 서비스 비교 / 계절별 주의사항 / 생활 팁' },
      {
        id: 'summary',
        label: '설명',
        type: 'textarea',
        defaultValue: '주제의 성격을 먼저 파악한 뒤 정보형 블로그 글로 자연스럽게 정리',
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
        defaultValue: '필요할 때만 이미지 프롬프트 제공',
        options: [
          { label: '필요할 때만 사용', value: '필요할 때만 이미지 프롬프트 제공' },
          { label: '이미지 없이 진행', value: '이미지 없이 텍스트 중심으로 작성' },
        ],
      },
      {
        id: 'include',
        label: '필수 포함 내용',
        type: 'text',
        defaultValue: '주제 소개, 핵심 요약, 배경 설명, 실용 포인트, 주의사항, 마무리 정리',
      },
      {
        id: 'exclude',
        label: '피해야 할 표현',
        type: 'text',
        defaultValue: '과장 표현, 광고성 문장, 확인되지 않은 단정, 불필요한 장문',
      },
      {
        id: 'contentType',
        label: '주제 성격',
        type: 'select',
        defaultValue: 'AI가 주제에 맞게 판단',
        options: [
          { label: 'AI가 주제에 맞게 판단', value: 'AI가 주제에 맞게 판단' },
          { label: '생활 정보', value: '생활 정보' },
          { label: '서비스/앱 소개', value: '서비스/앱 소개' },
          { label: '비교/추천', value: '비교/추천' },
          { label: '주의사항/체크리스트', value: '주의사항/체크리스트' },
        ],
      },
      {
        id: 'summaryStyle',
        label: '정리 방식',
        type: 'select',
        defaultValue: '핵심 요약과 실용 팁 포함',
        options: [
          { label: '핵심 요약과 실용 팁 포함', value: '핵심 요약과 실용 팁 포함' },
          { label: '체크리스트 포함', value: '체크리스트 포함' },
          { label: '비교 포인트 포함', value: '비교 포인트 포함' },
          { label: '짧고 담백하게', value: '짧고 담백하게' },
        ],
      },
      {
        id: 'referenceLinks',
        label: '참고 링크',
        type: 'textarea',
        placeholder: '예: 관련 기사, 공식 안내, 서비스 페이지, 유튜브 링크를 줄바꿈으로 입력',
        helperText: '입력한 링크가 있으면 주제 성격을 판단하는 참고 자료로 활용합니다.',
      },
    ],
    resultFormat: `${blogHtmlOutputGuidelines}

이번 글은 기타 정보형 카테고리용입니다. 아래 조건을 반영해서 실제 블로그에 바로 쓸 수 있는 완성형 HTML 결과물로 작성해주세요.

- 주제: {{topic}}
- 추가 설명: {{summary}}
- 원하는 분량: {{length}}
- 이미지 사용 기준: {{imagePolicy}}
- 꼭 포함할 내용: {{include}}
- 피해야 할 표현: {{exclude}}
- 주제 성격: {{contentType}}
- 정리 방식: {{summaryStyle}}
- 참고 링크: {{referenceLinks}}

먼저 주제 성격을 자연스럽게 파악한 뒤 설명형 + 가이드형 글로 풀어주세요.
참고 링크가 있으면 공식 안내, 서비스 페이지, 기사, 영상 내용을 참고해서 핵심 정보를 판단하고, 서로 충돌하는 내용은 공통 사실 중심으로 정리해주세요.
실생활에 도움이 되는 구조를 우선하고, 생활 정보, 서비스 소개, 비교, 추천, 체크리스트형 주제에 맞게 유연하게 구성해주세요.`,
  },
]
