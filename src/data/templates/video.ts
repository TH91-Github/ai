import type { PromptTemplate } from '../../types/prompt'

export const videoTemplates: PromptTemplate[] = [
  {
    id: 'video-script-plan',
    categoryId: 'video',
    name: '영상 기획/대본 초안',
    description: '영상 주제와 구성 방향을 정리한 기획용 프롬프트 초안입니다.',
    fields: [
      { id: 'topic', label: '주제', type: 'text', placeholder: '예: 초보자를 위한 홈트레이닝 루틴 영상' },
      { id: 'keywords', label: '키워드', type: 'tags', placeholder: '예: 5분 루틴, 초보자, 따라하기' },
      { id: 'summary', label: '설명', type: 'textarea', placeholder: '영상의 핵심 메시지와 전달 포인트를 적어주세요.' },
      { id: 'goal', label: '목적', type: 'text', placeholder: '예: 숏폼 영상 기획안과 대본 뼈대 정리' },
      { id: 'length', label: '분량', type: 'text', placeholder: '예: 60초 영상 기준' },
      {
        id: 'include',
        label: '필수 장면 요소',
        type: 'tags',
        placeholder: '예: 오프닝 훅, 장면 전환, 자막 포인트, 콜투액션',
      },
      {
        id: 'exclude',
        label: '피해야 할 연출',
        type: 'tags',
        placeholder: '예: 장황한 설명, 느린 전개, 뜬금없는 전환',
      },
    ],
    resultFormat: `다음 주제에 맞춰 영상 기획 또는 대본 초안 프롬프트를 작성해줘.

주제: {{topic}}
핵심 키워드: {{keywords}}
영상 설명: {{summary}}
목적: {{goal}}
영상 길이 기준: {{length}}
필수 장면 요소: {{include}}
피해야 할 연출: {{exclude}}

결과는 장면 흐름, 핵심 메시지, 말투 방향이 보이도록 한글 초안 형태로 정리해줘.`,
  },
]
