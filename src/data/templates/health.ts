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
    ],
    resultFormat: `${blogHtmlOutputGuidelines}

[입력값]
카테고리: 건강
주제: {{topic}}
추가 설명: {{summary}}
원하는 분량: {{length}}
이미지 사용 기준: {{imagePolicy}}
필수 포함 내용: {{include}}
피해야 할 표현: {{exclude}}
대상: {{target}}
입력 유형: {{inputType}}
중심 증상: {{symptomFocus}}
안전 안내: {{medicalSafety}}

[카테고리별 생성 규칙: 건강]
- 사용자가 입력한 단어가 중의적이면 의료 맥락으로 해석할 것. 예: "사마귀"는 곤충이 아니라 피부 사마귀로 해석
- 절대 확정 진단처럼 쓰지 말고, "의심 가능한 원인", "가능성", "참고용", "진료가 필요한 신호" 중심으로 설명할 것
- 글 초반에 응급 상황 또는 즉시 병원에 가야 하는 경우를 먼저 구분할 것
- 건강 정보는 실제 의료기관 진료를 대체하지 않는다는 취지를 자연스럽게 포함할 것
- 가능한 경우 최신의 공신력 있는 의료 정보 기준으로 정리할 것
- 우선 참고 기준은 질병관리청, 국가건강정보포털, 서울아산병원, 삼성서울병원, 서울대병원, 세브란스, 분당서울대병원, Mayo Clinic, NHS, Cleveland Clinic, MedlinePlus, NIH, 관련 대한의학회 정보로 둘 것
- 블로그, 커뮤니티, 카페 정보는 핵심 근거로 쓰지 말고 사실 검증 보조 정도로만 볼 것
- 약 이름, 치료법, 운동법은 일반적인 예시 수준으로만 언급하고 처방이나 실행을 단정적으로 지시하지 말 것
- 검증되지 않은 민간요법, 과장된 완치 표현, 공포 조장 표현, 광고성 표현은 넣지 말 것

[증상 입력 시 구성]
- 증상 요약
- 의심 가능한 대표 원인 3~6개
- 위치, 양상, 동반 증상별 구분 포인트
- 집에서 우선 확인할 부분
- 응급 신호 또는 빨리 진료가 필요한 경우
- 어느 병원/어느 과를 가야 하는지
- 검사/진료에서 주로 확인하는 것
- 생활 관리와 악화 방지 팁

[질환명 또는 병명 입력 시 구성]
- 한 줄 정의
- 원인
- 대표 증상
- 헷갈리기 쉬운 다른 질환과 차이
- 치료 방법을 보존적 치료, 시술, 수술 가능성 수준으로 구분
- 어느 병원/어느 과를 가야 하는지
- 전염성, 재발 가능성, 주의사항 여부
- 집에서 관리할 때 주의할 점
- 언제 병원에 가야 하는지

[반드시 포함할 섹션]
- 제목
- 3줄 요약
- 이럴 때 많이 궁금해요
- 의심 가능한 원인 또는 질환 설명
- 구분 포인트
- 응급 신호 / 빨리 병원 가야 하는 경우
- 어느 병원/어느 과 가야 하나요?
- 치료 / 검사 / 관리
- 이런 경우는 집에서 버티지 말 것
- 핵심 요약
- 마무리 정리

[진료과 안내 기준]
- 병원 추천은 상업적 추천이 아니라 진료과 기준으로 설명할 것
- 주제에 따라 피부과, 정형외과, 재활의학과, 류마티스내과, 신경외과, 응급의학과 등을 자연스럽게 안내할 것

[마무리 문장 기준]
- 마지막에는 "증상만으로는 정확한 판단이 어려울 수 있어, 통증이 심하거나 오래가면 진료를 받아보는 것이 가장 안전합니다."라는 취지를 자연스럽게 포함할 것

[이미지 기준]
- 이미지가 필요한 경우 몸의 특정 부위를 과하게 자극적으로 표현하지 말고, 건강 정보 블로그에 어울리는 차분한 설명형 이미지 프롬프트로 작성할 것
- 본문 이미지는 해당 증상이나 질환 설명과 직접 관련된 경우에만 넣을 것
- 메타 설명, FAQ, 출처 목록은 만들지 말 것

위 조건을 모두 반영하여 실제로 저장 가능한 완성형 HTML 건강 정보 블로그 결과물을 작성해주세요.`,
  },
]
