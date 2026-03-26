import type { PromptTemplate } from '../types/prompt'

export const templates: PromptTemplate[] = [
  {
    id: 'dev-feature-request',
    categoryId: 'development',
    name: '기능 구현 요청',
    description: '개발자나 AI에게 기능 구현 방향을 명확히 전달하는 초안입니다.',
    fields: [
      { id: 'topic', label: '주제', type: 'text', placeholder: '예: 예약 시스템 관리자 페이지' },
      { id: 'keywords', label: '키워드', type: 'tags', placeholder: '예: React, TypeScript, 캘린더, 필터' },
      { id: 'summary', label: '설명', type: 'textarea', placeholder: '구현하려는 기능과 현재 상황을 적어주세요.' },
      {
        id: 'tone',
        label: '톤',
        type: 'select',
        options: [
          { label: '명확하고 실무적', value: '명확하고 실무적인 톤' },
          { label: '친절하고 자세한', value: '친절하고 자세한 톤' },
          { label: '간결하고 빠른', value: '간결하고 빠른 톤' },
        ],
      },
      { id: 'goal', label: '목적', type: 'text', placeholder: '예: 실제 구현 가능한 작업 지시서 정리' },
      { id: 'length', label: '분량', type: 'text', placeholder: '예: 핵심 위주 6~8문장' },
      { id: 'include', label: '포함할 요소', type: 'tags', placeholder: '예: 요구사항, 예외처리, 파일 구조' },
      { id: 'exclude', label: '제외할 요소', type: 'tags', placeholder: '예: 추상적인 설명, 불필요한 이론' },
    ],
    resultFormat: `다음 주제에 대해 {{tone}}으로 기능 구현 요청 프롬프트 초안을 작성해줘.

주제: {{topic}}
핵심 키워드: {{keywords}}
배경 설명: {{summary}}
목적: {{goal}}
원하는 분량: {{length}}
반드시 포함할 요소: {{include}}
제외할 요소: {{exclude}}

결과는 실제 작업에 바로 활용할 수 있도록 요구사항, 구현 포인트, 주의사항이 드러나는 한글 초안 형태로 정리해줘.`,
  },
  {
    id: 'blog-review-draft',
    categoryId: 'blog',
    name: '후기/정보형 글 초안',
    description: '블로그용 후기형 또는 정보형 글 구조를 잡아주는 초안입니다.',
    fields: [
      { id: 'topic', label: '주제', type: 'text', placeholder: '예: 제주도 2박 3일 가족여행 후기' },
      { id: 'keywords', label: '키워드', type: 'tags', placeholder: '예: 여행 코스, 맛집, 숙소, 팁' },
      { id: 'summary', label: '설명', type: 'textarea', placeholder: '글에 담고 싶은 경험이나 정보를 적어주세요.' },
      {
        id: 'tone',
        label: '톤',
        type: 'select',
        options: [
          { label: '친근하고 자연스럽게', value: '친근하고 자연스러운 톤' },
          { label: '전문적이고 신뢰감 있게', value: '전문적이고 신뢰감 있는 톤' },
          { label: '담백하고 정리형으로', value: '담백하고 정리형 톤' },
        ],
      },
      { id: 'goal', label: '목적', type: 'text', placeholder: '예: 검색 유입용 정보성 글 초안' },
      { id: 'length', label: '분량', type: 'text', placeholder: '예: 소제목 포함 1,500자 내외' },
      { id: 'include', label: '포함할 요소', type: 'tags', placeholder: '예: 도입부, 소제목, 팁, 마무리' },
      { id: 'exclude', label: '제외할 요소', type: 'tags', placeholder: '예: 과장 표현, 광고 느낌 문장' },
    ],
    resultFormat: `다음 정보를 바탕으로 {{tone}}의 블로그 글 초안 프롬프트를 만들어줘.

주제: {{topic}}
핵심 키워드: {{keywords}}
기본 설명: {{summary}}
작성 목적: {{goal}}
원하는 분량: {{length}}
꼭 포함할 요소: {{include}}
빼고 싶은 요소: {{exclude}}

결과는 사람이 검수하고 다듬기 쉬운 한글 초안 형태로, 제목 방향과 소제목 흐름이 드러나게 정리해줘.`,
  },
  {
    id: 'video-script-plan',
    categoryId: 'video',
    name: '영상 기획/대본 초안',
    description: '영상 주제와 구성 방향을 정리한 기획용 프롬프트 초안입니다.',
    fields: [
      { id: 'topic', label: '주제', type: 'text', placeholder: '예: 초보자를 위한 홈트레이닝 루틴 영상' },
      { id: 'keywords', label: '키워드', type: 'tags', placeholder: '예: 5분 루틴, 초보자, 따라하기' },
      { id: 'summary', label: '설명', type: 'textarea', placeholder: '영상의 핵심 메시지와 전달 포인트를 적어주세요.' },
      {
        id: 'tone',
        label: '톤',
        type: 'select',
        options: [
          { label: '에너지 있게', value: '에너지 있고 몰입감 있는 톤' },
          { label: '차분하고 설명형으로', value: '차분하고 설명형 톤' },
          { label: '트렌디하고 짧게', value: '트렌디하고 짧은 숏폼 톤' },
        ],
      },
      { id: 'goal', label: '목적', type: 'text', placeholder: '예: 숏폼 영상 기획안과 대본 뼈대 정리' },
      { id: 'length', label: '분량', type: 'text', placeholder: '예: 60초 영상 기준' },
      { id: 'include', label: '포함할 요소', type: 'tags', placeholder: '예: 오프닝 훅, 장면 구성, 콜투액션' },
      { id: 'exclude', label: '제외할 요소', type: 'tags', placeholder: '예: 장황한 설명, 전문 용어 남발' },
    ],
    resultFormat: `다음 주제에 맞춰 {{tone}}의 영상 기획 또는 대본 초안 프롬프트를 작성해줘.

주제: {{topic}}
핵심 키워드: {{keywords}}
영상 설명: {{summary}}
목적: {{goal}}
영상 길이 기준: {{length}}
반드시 들어갈 요소: {{include}}
제외할 요소: {{exclude}}

결과는 장면 흐름, 핵심 메시지, 말투 방향이 보이도록 한글 초안 형태로 정리해줘.`,
  },
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
      { id: 'include', label: '포함할 요소', type: 'tags', placeholder: '예: 목소리 톤, 속도감, 배경음 분위기' },
      { id: 'exclude', label: '제외할 요소', type: 'tags', placeholder: '예: 지나치게 화려한 효과음, 과한 감정 표현' },
    ],
    resultFormat: `다음 내용을 기준으로 {{tone}}의 음성 또는 사운드 콘셉트 요청 프롬프트 초안을 정리해줘.

주제: {{topic}}
핵심 키워드: {{keywords}}
상세 설명: {{summary}}
목적: {{goal}}
원하는 분량: {{length}}
포함할 요소: {{include}}
제외할 요소: {{exclude}}

결과는 다른 제작자나 AI에게 전달하기 쉬운 한글 문장 형태로 정리해줘.`,
  },
]
