// =============================================================
// src/pages/DraftPage.tsx
// 역할: 초안 만들기 페이지
// 주요 기능:
//   - 블로그 타입 탭 전환 (일반 주제형 / 오늘의 역사형)
//   - 각 타입별 폼 렌더링
//   - 생성된 프롬프트 결과 표시
//   - 토스트 알림 관리
// =============================================================

import React, { useState } from 'react';
import GeneralDraftForm from '@/components/draft/GeneralDraftForm';
import HistoryDraftForm from '@/components/draft/HistoryDraftForm';
import SongDraftForm from '@/components/draft/SongDraftForm';
import VideoDraftForm from '@/components/draft/VideoDraftForm';
import PromptResult from '@/components/draft/PromptResult';
import Toast from '@/components/common/Toast';
import type { GeneratedPrompt, BlogType } from '@/types';
import { useToast } from '@/hooks/useToast';
import styles from './DraftPage.module.scss';

type TabType = 'general' | 'history' | 'song' | 'video';

const TABS: { key: TabType; label: string; desc: string }[] = [
  {
    key: 'general',
    label: '📝 일반 주제형',
    desc: '메인/세부 주제를 선택하여 블로그 프롬프트를 생성합니다',
  },
  {
    key: 'history',
    label: '📅 오늘의 역사형',
    desc: '날짜 기준 역사적 사건 기반 프롬프트를 생성합니다',
  },
  {
    key: 'song',
    label: '🎵 노래',
    desc: 'Suno 프롬프트와 유튜브 제목·설명·태그를 함께 생성합니다',
  },
  {
    key: 'video',
    label: '🎬 영상',
    desc: '영상 생성 AI나 제작 도구에 넣을 수 있는 영상 프롬프트를 생성합니다',
  },
];

const DraftPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [result, setResult] = useState<GeneratedPrompt | null>(null);
  const [resultMainTopic, setResultMainTopic] = useState('');
  const { toasts, show: showToast, remove: removeToast } = useToast();

  const handleGenerated = (r: GeneratedPrompt, mainTopic = '') => {
    setResult(r);
    setResultMainTopic(mainTopic);
    showToast('프롬프트가 생성되었습니다!', 'success');
    // 결과 영역으로 스크롤
    setTimeout(() => {
      document
        .getElementById('prompt-result')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setResult(null);
  };

  return (
    <div className={styles.page}>
      {/* Toast 알림 */}
      <div className={styles.toastContainer}>
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>초안 만들기</h1>
        <p className={styles.pageDesc}>
          AI(ChatGPT, Claude 등)에 붙여넣을 한국어 프롬프트를 생성합니다
        </p>
      </div>

      <div className={styles.layout}>
        {/* 왼쪽: 폼 영역 */}
        <section className={styles.formSection}>
          {/* 탭 */}
          <div className={styles.tabBar}>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={[
                  styles.tab,
                  activeTab === tab.key ? styles.tabActive : '',
                ].join(' ')}
                onClick={() => handleTabChange(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className={styles.tabDesc}>
            {TABS.find((t) => t.key === activeTab)?.desc}
          </div>

          <div className={styles.formCard}>
            {activeTab === 'general' ? (
              <GeneralDraftForm
                onGenerated={(r) => {
                  // GeneralDraftForm에서 mainTopic 전달이 필요하므로 내부 상태 별도 처리
                  setResult(r);
                  setResultMainTopic('');
                  showToast('프롬프트가 생성되었습니다!', 'success');
                }}
                onDuplicateWarning={(msg) => showToast(msg, 'warning')}
                onError={(msg) => showToast(msg, 'error')}
              />
            ) : activeTab === 'history' ? (
              <HistoryDraftForm
                onGenerated={(r) => handleGenerated(r, '역사')}
                onError={(msg) => showToast(msg, 'error')}
              />
            ) : activeTab === 'song' ? (
              <SongDraftForm
                onGenerated={(r) => handleGenerated(r, '노래')}
                onError={(msg) => showToast(msg, 'error')}
              />
            ) : (
              <VideoDraftForm
                onGenerated={(r) => handleGenerated(r, '영상')}
                onError={(msg) => showToast(msg, 'error')}
              />
            )}
          </div>
        </section>

        {/* 오른쪽: 결과 영역 */}
        <section className={styles.resultSection} id="prompt-result">
          {result ? (
            <>
              <h2 className={styles.resultTitle}>생성된 프롬프트</h2>
              <PromptResult
                result={result}
                mainTopic={resultMainTopic}
                type={activeTab as BlogType}
                onSaved={() => showToast('등록 목록에 저장되었습니다', 'success')}
                onCopied={() => showToast('클립보드에 복사되었습니다', 'success')}
                onError={(msg) => showToast(msg, 'error')}
              />
            </>
          ) : (
            <div className={styles.emptyResult}>
              <span className={styles.emptyIcon}>✨</span>
              <p>왼쪽 폼을 작성하고<br />프롬프트를 생성하세요</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DraftPage;
