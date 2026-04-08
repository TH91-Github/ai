import type { PromptTemplate } from '../../types/prompt'
import { blogHtmlOutputGuidelines } from './imageGuidelines'

export const worldNewsTemplates: PromptTemplate[] = [
  {
    id: 'world-news-master',
    categoryId: 'world-news',
    name: '세계뉴스 HTML 블로그',
    description: '최근 흐름과 글로벌 영향을 중립적으로 정리하는 완성형 HTML 뉴스 블로그 프롬프트입니다.',
    fields: [
      { id: 'topic', label: '주제', type: 'text', required: true, placeholder: '예: 오늘 세계 경제 뉴스 요약' },
      {
        id: 'summary',
        label: '설명',
        type: 'textarea',
        defaultValue: '가장 큰 이슈를 메인으로, 관련 서브 이슈까지 함께 정리',
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
        defaultValue: '썸네일과 본문 이미지 프롬프트 제공',
        options: [
          { label: '이미지 프롬프트 포함', value: '썸네일과 본문 이미지 프롬프트 제공' },
          { label: '이미지 최소화', value: '이미지는 최소화하고 필요한 프롬프트만 제공' },
        ],
      },
      {
        id: 'include',
        label: '필수 포함 내용',
        type: 'text',
        defaultValue: '핵심 이슈, 배경, 글로벌 영향, 시장 및 사회적 영향, 체크 포인트',
      },
      {
        id: 'exclude',
        label: '피해야 할 표현',
        type: 'text',
        defaultValue: '자극적 제목, 확정적 해석, 루머성 내용',
      },
      {
        id: 'region',
        label: '지역',
        type: 'text',
        defaultValue: '미국, 유럽, 아시아 등 주요 지역 중심',
        placeholder: '예: 미국, 유럽',
      },
      {
        id: 'timeframe',
        label: '시점',
        type: 'text',
        defaultValue: '최근 12시간 기준, 가장 최신 뉴스 우선',
        placeholder: '예: 최근 12시간, 오늘 오전',
      },
      {
        id: 'referenceLinks',
        label: '참고 링크',
        type: 'textarea',
        placeholder: '예: 뉴스 기사 URL, 유튜브 링크, 참고한 리포트 링크를 줄바꿈으로 입력',
        helperText: '입력한 링크가 있으면 본문 맥락에 맞게 참고 자료로만 자연스럽게 반영합니다.',
      },
      {
        id: 'neutralTone',
        label: '중립적 톤 여부',
        type: 'select',
        defaultValue: '사실 중심, 중립적 톤으로 정리',
        options: [
          { label: '사실 중심, 중립적 톤', value: '사실 중심, 중립적 톤으로 정리' },
          { label: '설명형 위주', value: '설명형 위주로 정리' },
        ],
      },
    ],
    resultFormat: `${blogHtmlOutputGuidelines}

이번 글은 세계뉴스 카테고리용입니다. 아래 조건을 반영해서 실제 블로그에 바로 쓸 수 있는 완성형 HTML 뉴스 글로 작성해주세요.

- 주제: {{topic}}
- 추가 설명: {{summary}}
- 원하는 분량: {{length}}
- 이미지 사용 기준: {{imagePolicy}}
- 꼭 포함할 내용: {{include}}
- 피해야 할 표현: {{exclude}}
- 지역 범위: {{region}}
- 기준 시점: {{timeframe}}
- 참고 링크: {{referenceLinks}}
- 작성 톤: {{neutralTone}}

최근 12시간 안의 가장 최신 뉴스 흐름을 우선 반영하고, 오래된 배경보다 최신 전개와 새로 나온 공식 발언, 시장 반응 변화를 먼저 정리해주세요.
핵심 이슈, 배경, 글로벌 영향, 시장 및 사회적 영향, 지금 봐야 할 흐름이 자연스럽게 이어지게 작성해주세요.
참고 링크가 있으면 기사, 유튜브, 리포트 내용을 우선 참고하되 서로 충돌하는 내용은 단정하지 말고 공통 사실 중심으로 정리해주세요.
참고 링크가 있으면 HTML 하단에 짧은 참고 링크 영역만 추가하고, 별도 출처 목록처럼 길게 만들지는 말아주세요.
과장, 루머, 확정 표현은 피하고 사실 중심의 중립적인 톤을 유지해주세요.`,
  },
]
