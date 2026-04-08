import type { PromptTemplate } from '../../types/prompt'

export const audioTemplates: PromptTemplate[] = [
  {
    id: 'music-production-request',
    categoryId: 'music',
    name: '음악 제작 요청문',
    description: '장르, 감정, 보컬, BPM, 구성, 사운드 요소를 정리해 음악 생성 AI에 전달하는 요청문입니다.',
    fields: [
      { id: 'topic', label: '곡 주제', type: 'text', required: true, placeholder: '예: 새벽 도시에 혼자 남은 기분' },
      {
        id: 'genre',
        label: '장르',
        type: 'text',
        defaultValue: '팝 또는 일렉트로닉 기반',
        placeholder: '예: 팝, R&B, 힙합, 시네마틱',
      },
      {
        id: 'subGenre',
        label: '서브 장르',
        type: 'text',
        defaultValue: '감성적인 서브 장르로 자연스럽게 보완',
        placeholder: '예: 드림팝, 로파이 힙합, 얼터너티브 R&B',
      },
      {
        id: 'artistReference',
        label: '참고 아티스트 / 느낌',
        type: 'textarea',
        defaultValue: '특정 곡을 그대로 복제하지 말고, 분위기와 감정선만 참고',
        placeholder: '예: NewJeans의 담백한 무드, Keshi의 몽환적인 질감',
      },
      {
        id: 'overallMood',
        label: '전체 분위기',
        type: 'text',
        defaultValue: '감정선이 분명하고 몰입감 있는 분위기',
        placeholder: '예: 몽환적, 서늘함, 따뜻함, 청량함',
      },
      {
        id: 'emotionKeywords',
        label: '감정 키워드',
        type: 'text',
        defaultValue: '외로움, 설렘, 여운, 긴장감',
        placeholder: '예: 불안, 해방감, 애틋함',
      },
      {
        id: 'vocalPresence',
        label: '보컬 여부',
        type: 'select',
        defaultValue: '보컬',
        options: [
          { label: '보컬', value: '보컬' },
          { label: '인스트루멘탈', value: '인스트루멘탈' },
        ],
      },
      {
        id: 'vocalGender',
        label: '보컬 성별',
        type: 'select',
        defaultValue: '주제에 맞게 자연스럽게 선택',
        options: [
          { label: '주제에 맞게 선택', value: '주제에 맞게 자연스럽게 선택' },
          { label: '여성 보컬', value: '여성 보컬' },
          { label: '남성 보컬', value: '남성 보컬' },
          { label: '혼성 또는 레이어드', value: '혼성 또는 레이어드' },
        ],
      },
      {
        id: 'vocalStyle',
        label: '보컬 스타일',
        type: 'text',
        defaultValue: '감정이 과하지 않고 자연스럽게 전달되는 스타일',
        placeholder: '예: 감성적, 힘있는, 속삭이듯, 담백하게',
      },
      {
        id: 'language',
        label: '언어',
        type: 'text',
        defaultValue: '한국어',
        placeholder: '예: 한국어, 영어, 무가사',
      },
      {
        id: 'bpm',
        label: 'BPM',
        type: 'text',
        defaultValue: '주제와 분위기에 맞는 중간 템포',
        placeholder: '예: 92, 120, 140',
      },
      {
        id: 'structure',
        label: '구성',
        type: 'text',
        defaultValue: '인트로, 벌스, 프리코러스, 코러스, 브릿지, 아웃트로',
        placeholder: '예: 인트로 / 벌스 / 코러스 / 브릿지',
      },
      {
        id: 'duration',
        label: '길이',
        type: 'text',
        defaultValue: '2분 30초에서 3분 30초 사이',
        placeholder: '예: 2분 40초',
      },
      {
        id: 'mainInstruments',
        label: '주요 악기',
        type: 'text',
        defaultValue: '패드, 피아노, 베이스, 드럼을 중심으로 구성',
        placeholder: '예: 피아노, 신스 베이스, 일렉 기타',
      },
      {
        id: 'soundFeatures',
        label: '특징 요소',
        type: 'text',
        defaultValue: '로파이 질감, 적당한 리버브, 공간감 있는 사운드',
        placeholder: '예: 빈티지, 신스, 테이프 질감, 글리치',
      },
      {
        id: 'lyricTopic',
        label: '가사 주제',
        type: 'text',
        placeholder: '예: 멀어진 관계를 받아들이는 과정',
      },
      {
        id: 'lyricMessage',
        label: '핵심 메시지',
        type: 'text',
        placeholder: '예: 떠나보내지만 완전히 무너지지는 않음',
      },
      {
        id: 'lyricKeywords',
        label: '가사 키워드',
        type: 'text',
        placeholder: '예: 새벽, 네온, 발자국, 잔향',
      },
      {
        id: 'referenceLinks',
        label: '참고 링크',
        type: 'textarea',
        placeholder: '예: 참고 곡, 라이브 영상, 음악 분석 링크를 줄바꿈으로 입력',
        helperText: '입력한 링크가 있으면 분위기와 사운드 방향을 참고하되 그대로 복제하지 않습니다.',
      },
    ],
    resultFormat: `아래 조건을 바탕으로 음악 생성 AI나 작곡 도구에 바로 붙여넣을 수 있는 자연스러운 한국어 요청문으로 정리해주세요.

- 곡 주제: {{topic}}
- 장르: {{genre}}
- 서브 장르: {{subGenre}}
- 참고 아티스트 / 느낌: {{artistReference}}
- 전체 분위기: {{overallMood}}
- 감정 키워드: {{emotionKeywords}}
- 보컬 여부: {{vocalPresence}}
- 보컬 성별: {{vocalGender}}
- 보컬 스타일: {{vocalStyle}}
- 언어: {{language}}
- BPM: {{bpm}}
- 구조: {{structure}}
- 길이: {{duration}}
- 주요 악기: {{mainInstruments}}
- 특징 요소: {{soundFeatures}}
- 가사 주제: {{lyricTopic}}
- 핵심 메시지: {{lyricMessage}}
- 가사 키워드: {{lyricKeywords}}
- 참고 링크: {{referenceLinks}}

요청문은 너무 딱딱한 표 형식이나 내부 규칙 설명처럼 쓰지 말고, 실제 제작자에게 전달하는 음악 디렉션 문장처럼 자연스럽게 정리해주세요.
특정 아티스트나 곡을 그대로 복제하라는 표현은 피하고, 분위기와 감정선, 사운드 질감만 참고하는 방향으로 써주세요.
보컬이 있는 경우에는 보컬 톤과 감정 전달 방식을 포함하고, 인스트루멘탈이면 멜로디와 분위기 중심으로 자연스럽게 바꿔주세요.
가사 항목이 비어 있으면 가사 관련 요청은 억지로 넣지 말고, 값이 있으면 곡의 메시지와 키워드를 반영해 자연스럽게 포함해주세요.
참고 링크가 있으면 사운드 질감, 편곡 방향, 분위기 참고용으로만 활용하고 그대로 복제하라는 표현은 쓰지 말아주세요.`,
  },
]
