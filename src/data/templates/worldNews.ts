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
        defaultValue: '최근 24시간 기준',
        placeholder: '예: 오늘, 이번 주',
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

[입력값]
카테고리: 세계뉴스 / 뉴스
주제: {{topic}}
추가 설명: {{summary}}
원하는 분량: {{length}}
이미지 사용 기준: {{imagePolicy}}
필수 포함 내용: {{include}}
피해야 할 표현: {{exclude}}
지역: {{region}}
기준 시점: {{timeframe}}
작성 톤: {{neutralTone}}

[카테고리별 생성 규칙: 세계뉴스 / 뉴스]
- 기준은 최근 24시간 흐름으로 잡을 것
- 핵심 이슈, 배경, 글로벌 영향, 시장 및 사회적 영향, 체크 포인트를 포함할 것
- 미국, 유럽, 아시아 등 주요 지역 흐름을 함께 반영할 것
- 사실 중심, 중립적 톤을 유지할 것
- 과장, 루머, 확정 표현을 피할 것
- 출처 목록은 만들지 말고, 입력된 정보와 확인 가능한 내용을 바탕으로 독자가 이해하기 쉽게 재구성할 것
- 메타 설명, FAQ, 출처 목록은 만들지 말 것

위 조건을 모두 반영하여 실제로 저장 가능한 완성형 HTML 뉴스 블로그 결과물을 작성해주세요.`,
  },
]
