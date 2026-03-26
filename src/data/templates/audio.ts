import type { PromptTemplate } from '../../types/prompt'

export const audioTemplates: PromptTemplate[] = [
  {
    id: 'audio-concept-request',
    categoryId: 'audio',
    name: '음성/사운드 콘셉트 요청',
    description: '음성 톤이나 배경 사운드 콘셉트를 설명하기 위한 초안입니다.',
    fields: [
      { id: 'topic', label: '주제', type: 'text', placeholder: '예: 브랜드 소개 영상 내레이션' },
      { id: 'keywords', label: '키워드', type: 'tags', placeholder: '예: 따뜻함, 신뢰감, 프리미엄' },
      { id: 'summary', label: '설명', type: 'textarea', placeholder: '원하는 분위기나 사용 장면을 적어주세요.' },
      {
        id: 'tone',
        label: '톤',
        type: 'select',
        options: [
          { label: '부드럽고 안정감 있게', value: '부드럽고 안정감 있는 톤' },
          { label: '밝고 경쾌하게', value: '밝고 경쾌한 톤' },
          { label: '묵직하고 몰입감 있게', value: '묵직하고 몰입감 있는 톤' },
        ],
      },
      { id: 'goal', label: '목적', type: 'text', placeholder: '예: 음성 콘셉트와 사운드 방향 설명 정리' },
      { id: 'length', label: '분량', type: 'text', placeholder: '예: 핵심 문장 중심 5문장 내외' },
      {
        id: 'include',
        label: '필수 사운드 요소',
        type: 'tags',
        placeholder: '예: 목소리 톤, 속도감, 배경음 분위기, 감정선',
      },
      {
        id: 'exclude',
        label: '피해야 할 사운드 요소',
        type: 'tags',
        placeholder: '예: 과한 효과음, 과장된 감정, 너무 빠른 속도',
      },
    ],
    resultFormat: `다음 내용을 기준으로 {{tone}}의 음성 또는 사운드 콘셉트 요청 프롬프트 초안을 정리해줘.

주제: {{topic}}
핵심 키워드: {{keywords}}
상세 설명: {{summary}}
목적: {{goal}}
원하는 분량: {{length}}
필수 사운드 요소: {{include}}
피해야 할 사운드 요소: {{exclude}}

결과는 다른 제작자나 AI에게 전달하기 쉬운 한글 문장 형태로 정리해줘.`,
  },
]
