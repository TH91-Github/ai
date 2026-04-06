import type { PromptCategory } from '../types/prompt'

export const categories: PromptCategory[] = [
  {
    id: 'development',
    name: '개발',
    description: '개념 설명, 사용법, 예제, 실무 팁 중심의 개발 블로그 프롬프트',
  },
  {
    id: 'stock',
    name: '주식',
    description: '시장 흐름, ETF, 종목 이슈를 신중하게 정리하는 정보형 프롬프트',
  },
  {
    id: 'world-news',
    name: '세계뉴스',
    description: '해외 이슈, 국제 뉴스, 흐름 요약을 정리하는 설명형 프롬프트',
  },
  {
    id: 'health',
    name: '건강',
    description: '생활 속 건강 정보와 주의사항을 정리하는 가이드형 프롬프트',
  },
  {
    id: 'winter-safety',
    name: '겨울철 조심',
    description: '한파, 운전, 가정, 건강 등 겨울철 주의사항을 다루는 프롬프트',
  },
  {
    id: 'history',
    name: '역사',
    description: '사건 배경과 흐름, 의미를 쉽게 설명하는 스토리형 프롬프트',
  },
  {
    id: 'recipe',
    name: '음식 레시피',
    description: '재료, 과정, 팁을 읽기 쉽게 정리하는 레시피형 프롬프트',
  },
]
