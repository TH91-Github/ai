import type { PromptTemplate } from '../../types/prompt'
import { blogHtmlOutputGuidelines } from './imageGuidelines'

export const healthTemplates: PromptTemplate[] = [
  {
    id: 'health-master',
    categoryId: 'health',
    name: '건강 증상 HTML 블로그',
    description: '증상이나 질환명을 바탕으로 원인, 구분 포인트, 진료 기준을 안전하게 정리하는 HTML 블로그 프롬프트입니다.',
    fields: [
      { id: 'topic', label: '주제', type: 'text', required: true, placeholder: '예: 왼쪽 아랫배 통증 원인과 대처법' },
      {
        id: 'summary',
        label: '설명',
        type: 'textarea',
        defaultValue: '증상 또는 질환명을 바탕으로 가능한 원인, 구분 포인트, 생활 관리, 진료가 필요한 기준을 초보자도 이해하기 쉽게 정리',
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
        defaultValue: '3줄 요약, 가능한 원인 또는 질환 설명, 구분 포인트, 응급 신호, 진료과 안내, 검사/치료/관리, 핵심 요약',
      },
      {
        id: 'exclude',
        label: '피해야 할 표현',
        type: 'text',
        defaultValue: '확정 진단, 단정적 치료 표현, 약 복용 지시, 검증되지 않은 민간요법, 과장',
      },
      {
        id: 'inputType',
        label: '입력 유형',
        type: 'select',
        defaultValue: 'AI가 증상/질환명을 판단',
        options: [
          { label: 'AI가 판단', value: 'AI가 증상/질환명을 판단' },
          { label: '증상 중심', value: '증상 중심' },
          { label: '질환명 중심', value: '질환명 중심' },
        ],
      },
      {
        id: 'target',
        label: '대상',
        type: 'select',
        defaultValue: '성인 일반',
        options: [
          { label: '성인 일반', value: '성인 일반' },
          { label: '어린이/보호자', value: '어린이/보호자' },
          { label: '중장년층', value: '중장년층' },
        ],
      },
      {
        id: 'symptomFocus',
        label: '중심 증상',
        type: 'text',
        defaultValue: '통증 위치, 증상 양상, 함께 나타나는 증상',
        placeholder: '예: 오른쪽 무릎 통증, 속쓰림, 두통',
      },
      {
        id: 'medicalSafety',
        label: '안전 안내',
        type: 'select',
        defaultValue: '응급 신호와 전문의 상담 기준 포함',
        options: [
          { label: '응급/진료 기준 포함', value: '응급 신호와 전문의 상담 기준 포함' },
          { label: '간단히 포함', value: '전문의 상담이 필요한 경우를 간단히 포함' },
        ],
      },
      {
        id: 'referenceLinks',
        label: '참고 링크',
        type: 'textarea',
        placeholder: '예: 질병관리청, 병원 안내, 학회 자료, 의료기관 링크를 줄바꿈으로 입력',
        helperText: '입력한 링크가 있으면 공신력 있는 의료 정보인지 우선 판단해 반영합니다.',
      },
    ],
    resultFormat: `${blogHtmlOutputGuidelines}

이번 글은 건강 카테고리용입니다. 아래 조건을 반영해서 실제 블로그에 바로 쓸 수 있는 완성형 HTML 건강 정보 글로 작성해주세요.

- 주제: {{topic}}
- 추가 설명: {{summary}}
- 원하는 분량: {{length}}
- 이미지 사용 기준: {{imagePolicy}}
- 꼭 포함할 내용: {{include}}
- 피해야 할 표현: {{exclude}}
- 대상: {{target}}
- 입력 유형: {{inputType}}
- 중심 증상: {{symptomFocus}}
- 안전 안내: {{medicalSafety}}
- 참고 링크: {{referenceLinks}}

입력한 단어가 중의적이면 의료 맥락으로 해석해주세요. 예를 들어 사마귀는 곤충이 아니라 피부 사마귀로 이해하면 됩니다.
확정 진단처럼 말하지 말고, 의심 가능한 원인이나 가능성, 참고용 정보, 진료가 필요한 신호 중심으로 설명해주세요.
글 초반에는 응급 상황이나 빨리 병원에 가야 하는 경우를 먼저 구분해주세요.
증상 중심이라면 증상 요약, 가능한 원인 3~6개, 구분 포인트, 집에서 확인할 부분, 응급 신호, 어느 과를 가야 하는지, 검사/진료에서 보는 것, 생활 관리 흐름으로 정리해주세요.
질환명 중심이라면 한 줄 정의, 원인, 대표 증상, 헷갈리기 쉬운 다른 질환과 차이, 치료 방법, 어느 과를 가야 하는지, 주의사항, 집에서 관리할 때 주의할 점, 언제 병원에 가야 하는지를 포함해주세요.
참고 링크가 있으면 공공기관, 병원, 학회, NIH/NHS/Mayo Clinic 같은 공신력 있는 링크를 우선 반영하고, 블로그나 커뮤니티 링크는 보조 참고 정도로만 활용해주세요.
주제에 따라 피부과, 정형외과, 재활의학과, 류마티스내과, 신경외과, 응급의학과 같은 진료과를 자연스럽게 안내해주세요.
마지막에는 증상만으로는 정확한 판단이 어려울 수 있어 통증이 심하거나 오래가면 진료를 받아보는 것이 가장 안전하다는 취지를 자연스럽게 포함해주세요.`,
  },
]
