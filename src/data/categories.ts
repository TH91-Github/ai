import type { PromptCategory } from '../types/prompt'

export const categories: PromptCategory[] = [
  {
    id: 'blog',
    name: '블로그',
    description: '정보형 블로그, 개념 설명, SEO 구조화 글 작성용',
  },
  {
    id: 'history',
    name: '역사/시사',
    description: '사건 배경, 흐름, 의미를 정리하는 설명형 글용',
  },
  {
    id: 'market',
    name: '주식/시장',
    description: '증시 브리핑, ETF, 시장 흐름 요약용',
  },
  {
    id: 'news',
    name: '뉴스 요약',
    description: '하루 종합 뉴스, 해외 이슈, 핵심 토픽 정리용',
  },
  {
    id: 'life',
    name: '생활정보',
    description: '실용 팁, 서비스, 제도 설명형 글용',
  },
  {
    id: 'ideas',
    name: '주제 추천',
    description: '검색 유입형 정보글 주제 추천과 기획용',
  },
  {
    id: 'development',
    name: '개발',
    description: '기능 구현, 코드 개선, 기술 작업 요청용 초안',
  },
  {
    id: 'video',
    name: '영상',
    description: '영상 기획, 구성안, 대본 초안 작성용',
  },
  {
    id: 'audio',
    name: '소리',
    description: '음성 톤, 사운드 콘셉트, 오디오 요청용',
  },
]
