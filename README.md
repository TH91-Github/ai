# BlogPrompt Tool

> AI(ChatGPT, Claude 등)에 붙여넣을 한국어 블로그 프롬프트를 생성하고, 등록 이력을 관리하는 도구입니다.

---

## 🚀 빠른 시작

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev

# 3. 프로덕션 빌드
npm run build
```

> **주의**: `.env` 파일은 절대 커밋하지 마세요.  
> `.env.example`을 복사해 `.env.local`을 생성하고 값을 입력하세요.

---

## 📁 폴더 구조

```
src/
├── assets/
│   └── styles/
│       ├── base/          # CSS 리셋
│       ├── utils/         # 변수, 믹스인
│       └── global.scss    # 전역 진입점
├── components/
│   ├── common/            # Button, Input, Select, Toggle, Badge, Toast
│   ├── draft/             # GeneralDraftForm, HistoryDraftForm, PromptResult
│   ├── layout/            # Layout (GNB + Outlet)
│   └── registry/          # RegistryCard
├── data/
│   └── topicPool.ts       # 메인/세부 주제 더미 풀
├── hooks/
│   └── useToast.ts        # 토스트 알림 훅
├── pages/
│   ├── DraftPage.tsx      # 초안 만들기
│   ├── RegistryPage.tsx   # 등록 목록
│   └── StatsPage.tsx      # 종합 통계
├── router/
│   └── index.tsx          # React Router 설정
├── store/
│   └── useRegistryStore.ts # Zustand + localStorage persist
├── types/
│   └── index.ts           # 핵심 TypeScript 타입
├── utils/
│   ├── duplicateCheck.ts  # 중복 방지 로직
│   ├── promptGenerator.ts # 프롬프트 생성 로직
│   └── statsHelper.ts     # 통계 계산
├── vite-env.d.ts          # SCSS 모듈 타입 선언
└── main.tsx               # 앱 진입점
```

---

## 🧩 주요 기능

### 초안 만들기
| 타입 | 설명 |
|------|------|
| 일반 주제형 | 메인/세부 주제 선택 → 한국어 블로그 프롬프트 생성 |
| 오늘의 역사형 | 날짜 기준 역사적 사건 프롬프트 생성 |

### 등록 목록
- 항목 추가 / 삭제 / 검색
- 중복 방지 기준 데이터로 활용

### 종합 통계
- 주제별 · 타입별 현황, 키워드 빈도, 최근 등록 글

---

## 🧠 중복 방지 로직

`src/utils/duplicateCheck.ts`에서 세 가지 기준으로 중복 여부를 판단합니다:

1. **subTopic 유사도** — bigram 기반 유사도 0.75 이상
2. **title 포함 관계** — 정규화 후 포함 관계
3. **핵심 키워드 2개 이상 겹침** — 정규화 후 교집합 체크

---

## 🎨 기술 스택

| 역할 | 라이브러리 |
|------|-----------|
| UI | React 18 + TypeScript |
| 빌드 | Vite 5 |
| 스타일 | SCSS Modules |
| 상태관리 | Zustand (persist) |
| 라우터 | React Router v6 |
| 저장소 | localStorage |

---

## ⚙️ 개발 규칙

- `.env` 파일 절대 업로드 금지
- API Key는 키명만 작성, 값은 비워둘 것
- 공통 UI 컴포넌트 (`Button`, `Input`, `Select`, `Toggle`, `Badge`, `Toast`) 반드시 사용
- 1파일 = 1컴포넌트 원칙
- 예외 처리 반드시 포함
