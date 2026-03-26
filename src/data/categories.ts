import type { PromptCategory } from '../types/prompt'

export const categories: PromptCategory[] = [
  {
    id: 'development',
    name: '개발',
    description: '기능 구현, 코드 개선, 기술 작업 요청용 초안',
  },
  {
    id: 'blog',
    name: '블로그',
    description: '후기형, 정보형, 정리형 글 초안 작성용',
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
