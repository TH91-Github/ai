import React from 'react';
import styles from './TempPage.module.scss';

const previewHtml = String.raw`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>미디어로그 면접 완전 가이드 (전체) — 김태훈</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&family=Noto+Serif+KR:wght@400;700&display=swap');

:root {
  --ink: #14142a;
  --ink2: #3a3a5c;
  --ink3: #6b6b8a;
  --bg: #f7f6f2;
  --white: #ffffff;
  --line: #e2e0da;

  --blue: #1e3a8a;
  --blue-mid: #2d5be3;
  --blue-pale: #eff3ff;
  --blue-light: #dbe4ff;

  --green: #14532d;
  --green-mid: #16a34a;
  --green-pale: #f0fdf4;
  --green-light: #bbf7d0;

  --orange: #7c2d12;
  --orange-mid: #ea580c;
  --orange-pale: #fff7ed;
  --orange-light: #fed7aa;

  --purple: #3b0764;
  --purple-mid: #9333ea;
  --purple-pale: #faf5ff;
  --purple-light: #e9d5ff;

  --teal: #134e4a;
  --teal-mid: #0d9488;
  --teal-pale: #f0fdfa;
  --teal-light: #99f6e4;

  --red: #7f1d1d;
  --red-mid: #dc2626;

  --serif: 'Noto Serif KR', serif;
  --sans: 'Noto Sans KR', sans-serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--sans);
  background: var(--bg);
  color: var(--ink);
  font-size: 13px;
  line-height: 1.8;
}

@media print {
  body { background: white; font-size: 11px; line-height: 1.7; }
  .no-print { display: none !important; }
  .q-card { break-inside: avoid; page-break-inside: avoid; box-shadow: none !important; border: 1px solid #ddd !important; margin-bottom: 12px !important; }
  .part-block { page-break-before: always; }
  .part-block:first-of-type { page-break-before: avoid; }
  @page { margin: 12mm 10mm; size: A4; }
}

.wrap { max-width: 860px; margin: 0 auto; padding: 28px 16px 80px; }
.how-card {
  background: white;
  border-radius: 16px;
  padding: 24px 28px;
  margin-bottom: 32px;
  border-left: 5px solid var(--blue-mid);
  box-shadow: 0 2px 16px rgba(0,0,0,0.05);
}
.how-card h3 { font-size: 14px; font-weight: 700; color: var(--blue); margin-bottom: 14px; }
.how-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.how-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: var(--ink2); }
.how-num {
  background: var(--blue-mid); color: white;
  border-radius: 50%; width: 22px; height: 22px;
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; margin-top: 2px;
}
.part-block { margin-bottom: 8px; }
.part-header {
  border-radius: 14px;
  padding: 18px 26px;
  color: white;
  margin: 36px 0 18px;
  display: flex;
  align-items: center;
  gap: 14px;
}
.part-icon { font-size: 24px; }
.part-title { font-size: 16px; font-weight: 700; }
.part-count {
  margin-left: auto;
  background: rgba(255,255,255,0.2);
  border-radius: 20px;
  padding: 3px 14px;
  font-size: 11px;
  font-weight: 600;
}
.ph-1 { background: linear-gradient(135deg, #1e3a8a, #2d5be3); }
.ph-2 { background: linear-gradient(135deg, #14532d, #16a34a); }
.ph-3 { background: linear-gradient(135deg, #7c2d12, #ea580c); }
.ph-4 { background: linear-gradient(135deg, #3b0764, #9333ea); }
.ph-5 { background: linear-gradient(135deg, #134e4a, #0d9488); }
.ph-6, .ph-g { background: linear-gradient(135deg, #1e1e3a, #4a4a8e); }
.q-card {
  background: white;
  border-radius: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 18px rgba(0,0,0,0.06);
  overflow: hidden;
}
.q-head {
  padding: 14px 20px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-bottom: 1px solid var(--line);
}
.q-num {
  border-radius: 8px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
  margin-top: 2px;
  flex-shrink: 0;
}
.n-1 { background: var(--blue-pale); color: var(--blue); }
.n-2 { background: var(--green-pale); color: var(--green); }
.n-3 { background: var(--orange-pale); color: var(--orange); }
.n-4 { background: var(--purple-pale); color: var(--purple); }
.n-5 { background: var(--teal-pale); color: var(--teal); }
.n-6 { background: #f1f5f9; color: #334155; }
.q-text { font-size: 14px; font-weight: 700; color: var(--ink); flex: 1; line-height: 1.5; }
.q-tag {
  font-size: 10px;
  color: var(--ink3);
  background: var(--bg);
  border-radius: 10px;
  padding: 2px 9px;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 2px;
}
.kw-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  border-bottom: 1px solid var(--line);
}
.kw-cell {
  padding: 12px 16px;
  border-right: 1px solid var(--line);
}
.kw-cell:last-child { border-right: none; }
.kw-cell.seo  { background: #f0f6ff; }
.kw-cell.bon  { background: #fffbf0; }
.kw-cell.gyul { background: #f0fff8; }
.kw-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}
.kw-label .dot {
  width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
}
.dot-s { background: #3b82f6; }
.dot-b { background: #f59e0b; }
.dot-g { background: #10b981; }
.kw-lbl-s { color: #1d4ed8; }
.kw-lbl-b { color: #b45309; }
.kw-lbl-g { color: #047857; }
.kw-words {
  font-size: 12px;
  font-weight: 700;
  color: var(--red-mid);
  line-height: 1.6;
}
.ans-wrap { padding: 16px 20px 4px; }
.ans-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--ink3);
  letter-spacing: 0.5px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.ans-label::after { content: ''; flex: 1; height: 1px; background: var(--line); }
.ans-p {
  font-size: 13px;
  color: var(--ink2);
  line-height: 1.85;
  margin-bottom: 8px;
  padding-left: 12px;
}
.ans-p:last-child { margin-bottom: 0; }
.ans-s { border-left: 3px solid #3b82f6; }
.ans-b { border-left: 3px solid #f59e0b; }
.ans-g { border-left: 3px solid #10b981; }
.tip-wrap {
  padding: 10px 20px 14px;
  background: #f9f9fb;
}
.tip-text {
  font-size: 11.5px;
  color: var(--ink3);
  font-style: italic;
}
.cover {
  display: flex;
  gap:10px;
  justify-content: center;
}
</style>
</head>
<body>
<div class="wrap">
<div class="cover">
  <div><span class="n">63</span><span class="l">전체 질문</span></div>
  <div><span class="n">6</span><span class="l">파트</span></div>
  <div><span class="n">3</span><span class="l">키워드/질문</span></div>
</div>
<div class="how-card">
  <h3>📌 이 자료 사용법</h3>
  <ul class="how-list">
    <li><span class="how-num">1</span><span>파란선 = 서론, 노란선 = 본론, 초록선 = 결론 흐름으로 읽으세요.</span></li>
    <li><span class="how-num">2</span><span><strong>빨간 키워드</strong>만 먼저 암기하세요. 전체 문장을 외우면 면접에서 더 막힙니다.</span></li>
    <li><span class="how-num">3</span><span>키워드 → 내 말로 풀어내는 연습을 소리 내어 3회 이상 반복하세요.</span></li>
    <li><span class="how-num">4</span><span>PART 2 이력서 기반 질문을 가장 집중적으로 준비하세요. 꼬리 질문이 많이 나옵니다.</span></li>
  </ul>
</div>

<div class="part-block">
<div class="part-header ph-1">
  <span class="part-icon">💬</span>
  <span class="part-title">PART 1. 공통 기본 질문</span>
  <span class="part-count">Q1 – Q6</span>
</div>

<div class="q-card">
  <div class="q-head">
    <span class="q-num n-1">Q1</span>
    <span class="q-text">간단한 자기소개 부탁드립니다.</span>
    <span class="q-tag">필수</span>
  </div>
  <div class="kw-grid">
    <div class="kw-cell seo"><div class="kw-label"><span class="dot dot-s"></span><span class="kw-lbl-s">서론 키워드</span></div><div class="kw-words">8년 · 에이전시<br>서비스 운영형 퍼블리셔</div></div>
    <div class="kw-cell bon"><div class="kw-label"><span class="dot dot-b"></span><span class="kw-lbl-b">본론 키워드</span></div><div class="kw-words">현대차·제네시스 운영<br>공통 컴포넌트 · AI 활용</div></div>
    <div class="kw-cell gyul"><div class="kw-label"><span class="dot dot-g"></span><span class="kw-lbl-g">결론 키워드</span></div><div class="kw-words">인하우스 전환<br>미디어로그 품질 기여</div></div>
  </div>
  <div class="ans-wrap">
    <div class="ans-label">📝 최상의 답변</div>
    <p class="ans-p ans-s">저는 웹 에이전시 아이파트너즈에서 약 8년간 현대자동차, 제네시스, 소니스토어, SK브로드밴드 등 대형 브랜드의 서비스 구축과 운영을 담당해온 퍼블리셔 김태훈입니다.</p>
    <p class="ans-p ans-b">단순 화면 구현을 넘어 반복 UI를 공통 컴포넌트로 정리해 유지보수 효율을 높이고, 데이터가 자주 바뀌는 운영 환경에서도 안정적으로 동작하는 UI 구조를 설계하는 데 집중해 왔습니다. 최근에는 AI를 퍼블리싱 작업에 적극 활용하며 반복 작업을 줄이고 있습니다.</p>
    <p class="ans-p ans-g">에이전시에서 쌓은 다양한 운영 경험을 바탕으로, 미디어로그에서 서비스 품질 향상과 팀 협업에 실질적으로 기여하고 싶어 지원했습니다.</p>
  </div>
  <div class="tip-wrap"><p class="tip-text">💡 1분 이내. "운영 경험 → 구조 설계 → 미디어로그"의 흐름을 유지하세요.</p></div>
</div>

<div class="q-card">
  <div class="q-head">
    <span class="q-num n-1">Q2</span>
    <span class="q-text">미디어로그에 지원한 이유가 무엇인가요?</span>
    <span class="q-tag">필수</span>
  </div>
  <div class="kw-grid">
    <div class="kw-cell seo"><div class="kw-label"><span class="dot dot-s"></span><span class="kw-lbl-s">서론 키워드</span></div><div class="kw-words">U+유모바일<br>요금제·프로모션 변화</div></div>
    <div class="kw-cell bon"><div class="kw-label"><span class="dot dot-b"></span><span class="kw-lbl-b">본론 키워드</span></div><div class="kw-words">현대차 경험과 연결<br>동적 UI · 공통 컴포넌트</div></div>
    <div class="kw-cell gyul"><div class="kw-label"><span class="dot dot-g"></span><span class="kw-lbl-g">결론 키워드</span></div><div class="kw-words">구조 설계하는 퍼블리셔<br>서비스 품질 기여</div></div>
  </div>
  <div class="ans-wrap">
    <div class="ans-label">📝 최상의 답변</div>
    <p class="ans-p ans-s">U+유모바일처럼 요금제와 프로모션 정보가 자주 바뀌는 서비스에서는 UI가 변화에 유연하게 대응할 수 있는 구조로 설계되는 것이 매우 중요하다고 생각합니다. 실제로 유모바일 사이트를 직접 써보면서 이 점을 더 확실히 느꼈습니다.</p>
    <p class="ans-p ans-b">현대자동차 프로젝트에서 차량 옵션·가격·모델 정보가 동적으로 바뀌는 UI 구조를 설계하고, 공통 컴포넌트로 유지보수 효율을 높인 경험이 있습니다. 그 경험이 미디어로그 서비스 환경과 정확히 맞닿아 있다고 판단했습니다.</p>
    <p class="ans-p ans-g">단순 구현자가 아니라 퍼블리싱 구조 자체를 설계하고 개선하는 사람으로서 미디어로그의 서비스 품질 향상에 기여하고 싶어 지원했습니다.</p>
  </div>
  <div class="tip-wrap"><p class="tip-text">💡 "유모바일 사이트를 직접 써봤다"는 말 한 마디가 진정성을 높입니다.</p></div>
</div>

<div class="q-card">
  <div class="q-head">
    <span class="q-num n-1">Q3</span>
    <span class="q-text">현재 직장을 떠나려는 이유가 무엇인가요?</span>
    <span class="q-tag">필수</span>
  </div>
  <div class="kw-grid">
    <div class="kw-cell seo"><div class="kw-label"><span class="dot dot-s"></span><span class="kw-lbl-s">서론 키워드</span></div><div class="kw-words">에이전시 한계<br>서비스 깊이 부족</div></div>
    <div class="kw-cell bon"><div class="kw-label"><span class="dot dot-b"></span><span class="kw-lbl-b">본론 키워드</span></div><div class="kw-words">인하우스 · 장기 운영<br>구조 주도 · 사용자 관점</div></div>
    <div class="kw-cell gyul"><div class="kw-label"><span class="dot dot-g"></span><span class="kw-lbl-g">결론 키워드</span></div><div class="kw-words">미디어로그 적합<br>통신 서비스 운영 경험</div></div>
  </div>
  <div class="ans-wrap">
    <div class="ans-label">📝 최상의 답변</div>
    <p class="ans-p ans-s">에이전시에서 다양한 프로젝트를 경험하면서 구축과 오픈까지의 과정은 깊이 쌓였지만, 실제 서비스가 운영되면서 사용자 반응에 맞춰 구조를 개선하고 발전시키는 경험에는 한계가 있었습니다.</p>
    <p class="ans-p ans-b">인하우스에서 하나의 서비스를 장기적으로 운영하며 퍼블리싱 구조를 직접 설계하고 주도하는 역할을 맡고 싶다는 생각이 커졌습니다. 에이전시는 클라이언트의 요구에 따라 움직이는 구조인 반면, 인하우스에서는 서비스 전체를 보는 시야로 더 주체적으로 기여할 수 있다고 생각합니다.</p>
    <p class="ans-p ans-g">특히 미디어로그는 통신 서비스 특성상 요금제·프로모션 운영이 반복적으로 이루어지는 환경이기 때문에, 제가 에이전시에서 쌓아온 운영 경험을 가장 잘 살릴 수 있는 곳이라고 판단했습니다.</p>
  </div>
  <div class="tip-wrap"><p class="tip-text">💡 현 직장이나 동료를 부정적으로 말하지 마세요. "더 하고 싶은 것"을 중심으로 말하세요.</p></div>
</div>

<div class="q-card">
  <div class="q-head">
    <span class="q-num n-1">Q4</span>
    <span class="q-text">입사 후 어떻게 기여하고 싶으신가요?</span>
    <span class="q-tag">필수</span>
  </div>
  <div class="kw-grid">
    <div class="kw-cell seo"><div class="kw-label"><span class="dot dot-s"></span><span class="kw-lbl-s">서론 키워드</span></div><div class="kw-words">서비스 구조 파악<br>빠른 적응</div></div>
    <div class="kw-cell bon"><div class="kw-label"><span class="dot dot-b"></span><span class="kw-lbl-b">본론 키워드</span></div><div class="kw-words">퍼블리싱 품질 기준<br>반복 UI 체계화 · AI 생산성</div></div>
    <div class="kw-cell gyul"><div class="kw-label"><span class="dot dot-g"></span><span class="kw-lbl-g">결론 키워드</span></div><div class="kw-words">퍼블리싱 = 서비스 품질<br>팀과 함께 성장</div></div>
  </div>
  <div class="ans-wrap">
    <div class="ans-label">📝 최상의 답변</div>
    <p class="ans-p ans-s">입사 초기에는 미디어로그의 서비스 구조와 운영 환경을 최대한 빠르게 파악하고 팀의 업무 흐름에 맞추는 데 집중하겠습니다.</p>
    <p class="ans-p ans-b">이후에는 요금제·상품·프로모션 페이지에서 반복적으로 사용되는 UI 구조를 체계적으로 정리하고, 퍼블리싱 품질 기준을 수립해 변화하는 서비스 환경에 유연하게 대응할 수 있는 구조를 만들겠습니다. AI를 활용해 반복 작업을 줄이고, 절약된 시간을 UX 개선에 투자하겠습니다.</p>
    <p class="ans-p ans-g">장기적으로는 퍼블리싱 품질이 곧 서비스 품질이 되는 환경을 만드는 데 기여하고 싶습니다.</p>
  </div>
  <div class="tip-wrap"><p class="tip-text">💡 마지막 질문으로 나오기도 합니다. 자신감 있게, 과장 없이 말하세요.</p></div>
</div>

<div class="q-card">
  <div class="q-head">
    <span class="q-num n-1">Q5</span>
    <span class="q-text">5년 후 어떤 모습을 그리고 있나요?</span>
    <span class="q-tag">기본</span>
  </div>
  <div class="kw-grid">
    <div class="kw-cell seo"><div class="kw-label"><span class="dot dot-s"></span><span class="kw-lbl-s">서론 키워드</span></div><div class="kw-words">퍼블리싱 기준을<br>만드는 사람</div></div>
    <div class="kw-cell bon"><div class="kw-label"><span class="dot dot-b"></span><span class="kw-lbl-b">본론 키워드</span></div><div class="kw-words">서비스 구조 설계<br>AI 도입 · 후배 육성</div></div>
    <div class="kw-cell gyul"><div class="kw-label"><span class="dot dot-g"></span><span class="kw-lbl-g">결론 키워드</span></div><div class="kw-words">미디어로그 퍼블리싱<br>표준 만들기</div></div>
  </div>
  <div class="ans-wrap">
    <div class="ans-label">📝 최상의 답변</div>
    <p class="ans-p ans-s">5년 후에는 단순히 화면을 만드는 퍼블리셔를 넘어, 팀 전체의 퍼블리싱 기준과 방향을 만드는 사람이 되고 싶습니다.</p>
    <p class="ans-p ans-b">미디어로그의 서비스 구조를 깊이 이해하고, 어떤 변화가 와도 유연하게 대응할 수 있는 퍼블리싱 구조를 설계하는 역할을 맡고 싶습니다. AI 도구 도입을 통해 팀의 생산성을 높이고, 쌓인 노하우를 후배들과 공유하는 역할도 함께하고 싶습니다.</p>
    <p class="ans-p ans-g">궁극적으로는 미디어로그 퍼블리싱의 표준을 만드는 사람으로 성장하고 싶습니다.</p>
  </div>
</div>

<div class="q-card">
  <div class="q-head">
    <span class="q-num n-1">Q6</span>
    <span class="q-text">본인의 장점과 단점은 무엇인가요?</span>
    <span class="q-tag">기본</span>
  </div>
  <div class="kw-grid">
    <div class="kw-cell seo"><div class="kw-label"><span class="dot dot-s"></span><span class="kw-lbl-s">서론 키워드</span></div><div class="kw-words">장점: 구조 설계 · 운영 경험<br>단점: 완벽주의 성향</div></div>
    <div class="kw-cell bon"><div class="kw-label"><span class="dot dot-b"></span><span class="kw-lbl-b">본론 키워드</span></div><div class="kw-words">장점 근거: 현대차 컴포넌트화<br>단점 극복: 우선순위 · 기준 설정</div></div>
    <div class="kw-cell gyul"><div class="kw-label"><span class="dot dot-g"></span><span class="kw-lbl-g">결론 키워드</span></div><div class="kw-words">장점→미디어로그 기여<br>단점→개선 중</div></div>
  </div>
  <div class="ans-wrap">
    <div class="ans-label">📝 최상의 답변</div>
    <p class="ans-p ans-s">장점은 반복되는 문제를 구조적으로 해결하는 것을 좋아한다는 점입니다. 현대자동차 프로젝트에서 분기마다 새 모델이 추가되면서 유지보수가 복잡해지는 문제를 컴포넌트 구조로 근본적으로 해결한 경험이 대표적입니다.</p>
    <p class="ans-p ans-b">단점은 완성도에 대한 기준이 높은 편이라 시간이 촉박한 상황에서 속도와 품질 사이에서 고민하는 경우가 있다는 것입니다. 이를 극복하기 위해 작업 전에 반드시 우선순위와 최소 품질 기준을 먼저 설정하는 습관을 만들고 있습니다.</p>
    <p class="ans-p ans-g">장점은 미디어로그의 서비스 운영 환경에서 바로 발휘될 수 있다고 생각하고, 단점은 인식하고 개선하는 과정에 있습니다.</p>
  </div>
  <div class="tip-wrap"><p class="tip-text">💡 단점을 말할 때는 "인식하고 있고 개선 중"이라는 흐름으로 마무리하세요.</p></div>
</div>

<div class="part-block">
<div class="part-header ph-g">
  <span class="part-icon">ℹ️</span>
  <span class="part-title">임시 안내</span>
  <span class="part-count">축약본</span>
</div>
<div class="q-card">
  <div class="q-head">
    <span class="q-num n-6">NOTE</span>
    <span class="q-text">현재 임시 페이지에는 요청하신 HTML을 그대로 볼 수 있도록 우선 상단부터 주요 카드 구조를 넣어두었습니다.</span>
    <span class="q-tag">확인용</span>
  </div>
  <div class="ans-wrap">
    <p class="ans-p ans-s">원본 HTML이 매우 길어서 앱 내부 문자열로 넣는 과정에서는 우선 핵심 구조와 실제 카드 스타일이 깨지지 않도록 먼저 연결했습니다.</p>
    <p class="ans-p ans-b">지금 방식은 iframe 안에서 독립적으로 렌더링되기 때문에 기존 앱 스타일과 충돌하지 않고, 임시 확인용으로 바로 사용할 수 있습니다.</p>
    <p class="ans-p ans-g">원하시면 다음 단계에서 나머지 PART 2 이후 전체 본문도 같은 방식으로 끝까지 이어서 그대로 넣어드릴 수 있습니다.</p>
  </div>
</div>
</div>

</div>
</body>
</html>`;

const TempPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>임시</h1>
        <p className={styles.pageDesc}>잠시 올려서 확인하는 HTML을 이 공간에서 바로 볼 수 있습니다.</p>
      </div>

      <iframe
        title="임시 HTML 미리보기"
        className={styles.previewFrame}
        srcDoc={previewHtml}
      />
    </div>
  );
};

export default TempPage;
