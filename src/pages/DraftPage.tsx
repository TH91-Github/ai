// =============================================================
// src/pages/DraftPage.tsx
// 역할: 초안 만들기 페이지
// 주요 기능:
//   - 블로그 타입 탭 전환 (일반 주제형 / 오늘의 역사형)
//   - 각 타입별 폼 렌더링
//   - 생성된 프롬프트 결과 표시
//   - 토스트 알림 관리
// =============================================================

import React, { useEffect, useMemo, useState } from 'react';
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
type DraftSection = 'blog' | 'song' | 'video';

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
    desc: '노래 제목과 가수명을 입력해 ChatGPT 요청 프롬프트를 생성합니다',
  },
  {
    key: 'video',
    label: '🎬 영상',
    desc: '영상 생성 AI나 제작 도구에 넣을 수 있는 영상 프롬프트를 생성합니다',
  },
];

const SECTION_TABS: Record<DraftSection, TabType[]> = {
  blog: ['general', 'history'],
  song: ['song'],
  video: ['video'],
};

const SECTION_META: Record<DraftSection, { title: string; desc: string }> = {
  blog: {
    title: '블로그 초안 만들기',
    desc: '일반 주제형과 오늘의 역사형 블로그 프롬프트를 생성합니다',
  },
  song: {
    title: '노래 초안 만들기',
    desc: '노래제목 - 가수명 형식으로 ChatGPT에게 전달할 요청 프롬프트를 만듭니다',
  },
  video: {
    title: '영상 초안 만들기',
    desc: '영상 생성 도구에 넣을 수 있는 영상 프롬프트를 생성합니다',
  },
};

interface DraftPageProps {
  section?: DraftSection;
}

const DraftPage: React.FC<DraftPageProps> = ({ section = 'blog' }) => {
  const availableTabs = useMemo(() => SECTION_TABS[section], [section]);
  const [activeTab, setActiveTab] = useState<TabType>(availableTabs[0]);
  const [result, setResult] = useState<GeneratedPrompt | null>(null);
  const [resultMainTopic, setResultMainTopic] = useState('');
  const { toasts, show: showToast, remove: removeToast } = useToast();

  useEffect(() => {
    setActiveTab(availableTabs[0]);
    setResult(null);
  }, [availableTabs]);

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
        <h1 className={styles.pageTitle}>{SECTION_META[section].title}</h1>
        <p className={styles.pageDesc}>
          {SECTION_META[section].desc}
        </p>
      </div>

      <div className={[styles.layout, section === 'song' ? styles.layoutSingle : ''].filter(Boolean).join(' ')}>
        {/* 왼쪽: 폼 영역 */}
        <section className={styles.formSection}>
          {/* 탭 */}
          {availableTabs.length > 1 && (
            <div className={styles.tabBar}>
              {availableTabs.map((tabKey) => {
                const tab = TABS.find((item) => item.key === tabKey);
                if (!tab) return null;

                return (
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
                );
              })}
            </div>
          )}

          <div className={styles.tabDesc}>
            {TABS.find((t) => t.key === activeTab)?.desc}
          </div>

          <div className={styles.formCard}>
            {activeTab === 'general' ? (
              <GeneralDraftForm
                onGenerated={(r, mainTopic) => handleGenerated(r, mainTopic)}
                onDuplicateWarning={(msg) => showToast(msg, 'warning')}
                onError={(msg) => showToast(msg, 'error')}
              />
            ) : activeTab === 'history' ? (
              <HistoryDraftForm
                onGenerated={(r) => handleGenerated(r, '역사')}
                onError={(msg) => showToast(msg, 'error')}
              />
            ) : activeTab === 'song' ? (
              <SongDraftForm onError={(msg) => showToast(msg, 'error')} />
            ) : (
              <VideoDraftForm
                onGenerated={(r) => handleGenerated(r, '영상')}
                onError={(msg) => showToast(msg, 'error')}
              />
            )}
          </div>
        </section>

        {section !== 'song' && (
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
        )}
      </div>
    </div>
  );
};

export default DraftPage;
