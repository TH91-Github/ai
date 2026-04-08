import type { PromptTemplate } from '../../types/prompt'
import { blogHtmlOutputGuidelines } from './imageGuidelines'

export const stockTemplates: PromptTemplate[] = [
  {
    id: 'stock-master',
    categoryId: 'stock',
    name: '주식 HTML 블로그',
    description: '시장 흐름, 주요 지수, 투자 심리를 신중하게 정리하는 HTML 블로그 프롬프트입니다.',
    fields: [
      { id: 'topic', label: '주제', type: 'text', required: true, placeholder: '예: 미국 증시 하루 요약' },
      {
        id: 'summary',
        label: '설명',
        type: 'textarea',
        defaultValue: '시장 분위기, 주요 지수 흐름, 핵심 뉴스와 체크 포인트를 초보자도 이해하기 쉽게 정리',
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
        defaultValue: '시장 흐름 요약, 주요 지수, 투자 심리, 단기/중기 관점, 리스크 구간',
      },
      {
        id: 'exclude',
        label: '피해야 할 표현',
        type: 'text',
        defaultValue: '투자 권유, 확정적 전망, 선동적 표현, 과장',
      },
      {
        id: 'riskProfile',
        label: '투자 성향',
        type: 'select',
        defaultValue: '중립적 정보 전달',
        options: [
          { label: '중립적 정보 전달', value: '중립적 정보 전달' },
          { label: '초보 투자자 관점', value: '초보 투자자 관점' },
        ],
      },
      {
        id: 'marketType',
        label: '시장',
        type: 'select',
        defaultValue: '미국 시장',
        options: [
          { label: '국내 시장', value: '국내 시장' },
          { label: '미국 시장', value: '미국 시장' },
        ],
      },
      {
        id: 'riskWarning',
        label: '리스크 경고 포함 여부',
        type: 'select',
        defaultValue: '포함',
        options: [
          { label: '포함', value: '포함' },
          { label: '간단히', value: '간단히' },
        ],
      },
      {
        id: 'referenceLinks',
        label: '참고 링크',
        type: 'textarea',
        placeholder: '예: 뉴스 기사, 증권사 리포트, ETF 페이지, 유튜브 링크를 줄바꿈으로 입력',
        helperText: '입력한 링크가 있으면 시장 흐름과 리스크 판단에 참고합니다.',
      },
    ],
    resultFormat: `${blogHtmlOutputGuidelines}

이번 글은 주식/증권 카테고리용입니다. 아래 조건을 반영해서 실제 블로그에 바로 쓸 수 있는 완성형 HTML 결과물로 작성해주세요.

- 주제: {{topic}}
- 추가 설명: {{summary}}
- 원하는 분량: {{length}}
- 이미지 사용 기준: {{imagePolicy}}
- 꼭 포함할 내용: {{include}}
- 피해야 할 표현: {{exclude}}
- 투자 성향 기준: {{riskProfile}}
- 시장: {{marketType}}
- 리스크 경고 포함 여부: {{riskWarning}}
- 참고 링크: {{referenceLinks}}

시장 흐름 요약, 주요 지수, 투자 심리, 단기/중기 관점이 자연스럽게 이어지게 작성해주세요.
QQQ, SPY 같은 주요 지수가 주제와 관련 있으면 자연스럽게 포함하고, 필요하면 매수/대기/리스크 구간도 투자 권유처럼 보이지 않게 설명해주세요.
참고 링크가 있으면 기사, 리포트, ETF/지수 페이지, 영상 내용을 우선 참고하되 공통 사실과 시장 해석을 구분해서 정리해주세요.
확정 표현, 과장, 선동적 표현은 피하고 신중한 정보형 문체를 유지해주세요.
차트는 실제 이미지 대신 차트 설명과 이미지 프롬프트로 처리해주세요.`,
  },
]
