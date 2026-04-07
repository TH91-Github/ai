import type { PromptCategory } from '../types/prompt'

export const categories: PromptCategory[] = [
  {
    id: 'development',
    name: '개발',
    description: '개념 설명, 사용법, 예제, 실무 팁 중심의 개발 블로그 프롬프트',
  },
  {
    id: 'world-news',
    name: '세계뉴스',
    description: '해외 이슈, 국제 뉴스, 흐름 요약을 정리하는 설명형 프롬프트',
  },
  {
    id: 'stock',
    name: '주식',
    description: '시장 흐름, ETF, 종목 이슈를 신중하게 정리하는 정보형 프롬프트',
  },
  {
    id: 'recipe',
    name: '음식 레시피',
    description: '재료, 과정, 팁을 읽기 쉽게 정리하는 레시피형 프롬프트',
  },
  {
    id: 'history',
    name: '역사',
    description: '사실 기반 역사 이야기를 쉽고 재미있게 풀어주는 블로그 프롬프트',
  },
  {
    id: 'winter-safety',
    name: '기타',
    description: '정해진 분류에 맞지 않는 주제를 정보형 블로그 글로 정리하는 범용 프롬프트',
  },
]
