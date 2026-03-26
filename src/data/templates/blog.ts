import type { PromptTemplate } from '../../types/prompt'

export const blogTemplates: PromptTemplate[] = [
  {
    id: 'blog-review-draft',
    categoryId: 'blog',
    name: '정보형 글 초안',
    description:
      '역사 이야기, 주식 브리핑, 개발 개념 설명처럼 정보 전달 중심 글을 작성하기 위한 템플릿입니다.',
    fields: [
      {
        id: 'blogMode',
        label: '블로그 유형',
        type: 'select',
        helperText: '주제 성격에 따라 일반 정보형 글과 코드 중심 개발자 블로그를 선택하세요.',
        options: [
          { label: '일반 정보형 글', value: '일반 정보형 글' },
          { label: '개발자 블로그', value: '개발자 블로그' },
        ],
      },
      {
        id: 'topic',
        label: '주제',
        type: 'text',
        placeholder: '예: 조선 후기 개혁 정책 정리 / 오늘의 미국 증시 브리핑 / JavaScript map 메서드',
      },
      {
        id: 'keywords',
        label: '키워드',
        type: 'tags',
        placeholder: '예: react useeffect, cleanup, 실행 시점, 예제',
      },
      {
        id: 'summary',
        label: '설명',
        type: 'textarea',
        placeholder: '전달하고 싶은 핵심 정보, 배경 설명, 정리 포인트를 적어주세요.',
      },
      { id: 'goal', label: '목적', type: 'text', placeholder: '예: 검색 유입용 정보 정리 / 개념 설명 / 브리핑 요약' },
      {
        id: 'length',
        label: '분량',
        type: 'text',
        placeholder: '예: 소제목 포함 1,500자 내외 / 코드 예시 포함 2,000자 내외',
      },
      {
        id: 'imagePolicy',
        label: '이미지 사용',
        type: 'select',
        options: [
          { label: '필요할 때만 사용', value: '필요할 때만 이미지 사용' },
          { label: '이미지 없이도 가능', value: '이미지 없이 텍스트 중심으로 작성' },
          { label: '코드 중심이라 이미지 최소화', value: '코드 중심이라 이미지 최소화' },
        ],
      },
      {
        id: 'include',
        label: '필수 포함 요소',
        type: 'tags',
        placeholder: '예: 핵심 개념 정리, 예시, 주의할 점, 코드 블록, 체크리스트',
      },
      {
        id: 'exclude',
        label: '피해야 할 표현',
        type: 'tags',
        placeholder: '예: 과장 표현, 광고 느낌, 중복 문장, 뻔한 마무리',
      },
      {
        id: 'notes',
        label: '내 경험/메모',
        type: 'textarea',
        placeholder: '예: 강조하고 싶은 맥락, 비교 포인트, 실제 사례, 정리 메모',
      },
    ],
    resultFormat: `당신은 한국어 블로그 전문 에디터이자 리서처다.

다음 정보를 바탕으로 블로그 글 작성용 프롬프트를 만들어줘.

글 유형: {{blogMode}}
글 성격: 정보형 + 가이드형 + SEO형
기본 톤: 정보 전달형, 광고 같지 않게, AI 티 나지 않게, 사실적인 문장 중심
사실성 원칙: 확인되지 않은 내용은 단정하지 말고, 불확실하면 확인 필요로 정리할 것
이미지 사용 기준: {{imagePolicy}}

주제: {{topic}}
핵심 키워드: {{keywords}}
기본 설명: {{summary}}
작성 목적: {{goal}}
원하는 분량: {{length}}
필수 포함 요소: {{include}}
피해야 할 표현: {{exclude}}
내 경험/메모: {{notes}}

추가 작성 원칙:
- 사용자가 주제로 역사, 시사, 주식 브리핑, 개발 개념, 메서드 사용법 등을 입력해도 정보형, 가이드형, SEO형 구조를 우선으로 정리할 것
- 후기 톤보다는 정보 전달 중심으로 작성할 것
- 광고 문구처럼 보이지 않게 쓰고, 과장 표현은 피할 것
- 거짓 정보나 추측성 문장은 넣지 말 것
- 사진은 많지 않아도 되며 꼭 필요한 경우에만 언급할 것
- 글 유형이 개발자 블로그인 경우 코드 예시와 소스 코드 블록을 중심으로 구성하고, 이미지가 꼭 필요하지 않으면 생략할 것
- 개발자 블로그라면 문제 상황, 해결 방법, 코드 예시, 적용 포인트, 주의사항이 드러나게 정리할 것

출력 형식:
[1] 주제 분석
- 글 유형:
- 핵심 독자:
- 검색 의도:

[2] 키워드 정리
- 메인 키워드:
- 서브 키워드:
- 함께 넣으면 좋은 연관 키워드:

[3] 자료 조사 및 팩트 체크
- 핵심 정보 요약:
- 확인된 사실:
- 확인이 필요한 부분:
- 주의할 표현:

[4] 제목 후보
1.
2.
3.

[5] 블로그 글 구조
- 도입:
- 본문 소제목 1:
- 본문 소제목 2:
- 본문 소제목 3:
- 마무리:

[6] 최종 블로그 초안
(자연스럽고 바로 사용할 수 있는 완성형 글로 작성)

추가 요청:
- 개발자 블로그인 경우 본문 안에 실제 코드 예시를 포함할 것
- 최종 제목 1개와 해시태그 10개도 마지막에 함께 정리할 것`,
  },
]
