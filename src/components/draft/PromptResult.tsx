// =============================================================
// src/components/draft/PromptResult.tsx
// 역할: 생성된 프롬프트 결과 표시 및 등록/복사/다운로드 액션 처리
// 주요 기능:
//   - 생성된 제목, 키워드, 프롬프트 본문 표시
//   - 클립보드 복사
//   - HTML 파일 다운로드 (includeHtml=true 시 활성화)
//     → AI가 반환한 HTML 결과물을 붙여넣고 .html로 저장하는 안내 포함
//   - 등록 목록 저장 (URL 입력 포함)
// 주의: HTML 다운로드는 AI 응답 결과를 textarea에 붙여넣은 뒤 저장하는 방식
// =============================================================

import React, { useState } from 'react';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Input from '@/components/common/Input';
import type { GeneratedPrompt, BlogType } from '@/types';
import { useRegistryStore } from '@/store/useRegistryStore';
import styles from './PromptResult.module.scss';

interface Props {
  result: GeneratedPrompt;
  mainTopic: string;
  type: BlogType;
  onSaved: () => void;
  onCopied: () => void;
  onError: (msg: string) => void;
}

const PromptResult: React.FC<Props> = ({
  result,
  mainTopic,
  type,
  onSaved,
  onCopied,
  onError,
}) => {
  const { addItem } = useRegistryStore();
  const [url, setUrl] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // HTML 다운로드용: AI 응답 결과를 붙여넣는 textarea
  const [htmlContent, setHtmlContent] = useState('');
  const [showHtmlPanel, setShowHtmlPanel] = useState(false);

  const getCopyText = () => {
    if (!result.songData) return result.prompt;

    return [
      'Style Prompt',
      result.songData.stylePrompt,
      '',
      'Expanded Production Notes',
      result.songData.expandedProductionNotes,
      '',
      'Lyrics & Structure',
      result.songData.lyricsAndStructure,
      '',
      'Uniqueness Strategy',
      ...result.songData.uniquenessStrategy.map((item) => `- ${item}`),
      '',
      '내부 구조 초안',
      result.songData.draftPrompt,
      '',
      'AI 정제 요청문',
      result.songData.refinementPrompt,
      '',
      'Suno 확장 프롬프트',
      result.songData.finalSunoPrompt,
      '',
      '설명',
      result.songData.descriptionKo,
      '',
      'Content ID 체크',
      ...result.songData.contentIdChecks.map((item) => `- ${item}`),
      '',
      '배포 안정성 체크',
      ...result.songData.distributionSafetyCheck.map((item) => `- ${item}`),
      '',
      'Content ID 주의 문구',
      result.songData.contentIdWarning,
      '',
      '유튜브 제목 추천',
      ...result.songData.youtubeTitles.map((item, index) => `${index + 1}. ${item}`),
      '',
      '유튜브 설명 초안',
      result.songData.youtubeDescription,
      '',
      '태그 추천',
      result.songData.tagRequestPrompt,
      '',
      '음원 등록 전 체크리스트',
      ...result.songData.preReleaseChecklist.map((item) => `- ${item}`),
      '',
      '메타데이터 작성 주의사항',
      ...result.songData.metadataNamingCaution.map((item) => `- ${item}`),
    ].join('\n');
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      onCopied();
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', 'true');
        textarea.style.position = 'fixed';
        textarea.style.top = '-9999px';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        const copied = document.execCommand('copy');
        document.body.removeChild(textarea);

        if (!copied) {
          throw new Error('copy failed');
        }

        onCopied();
      } catch {
        onError('클립보드 복사에 실패했습니다. 직접 선택하여 복사해 주세요.');
      }
    }
  };

  const handleCopy = async () => {
    await copyText(getCopyText());
  };

  // AI가 반환한 HTML 결과물을 .html 파일로 다운로드
  const handleHtmlDownload = () => {
    const content = htmlContent.trim();
    if (!content) {
      onError('AI가 생성한 HTML 결과물을 아래 입력창에 붙여넣어 주세요.');
      return;
    }
    try {
      const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeTitle = result.title.replace(/[\\/:*?"<>|]/g, '_').slice(0, 60);
      a.href = downloadUrl;
      a.download = `${safeTitle}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch {
      onError('HTML 파일 저장 중 오류가 발생했습니다.');
    }
  };

  const handleSave = () => {
    if (isSaved) return;
    try {
      addItem({
        category: 'blog',
        type,
        mainTopic,
        subTopic: result.subTopic,
        title: result.title,
        url: url.trim(),
        keywords: result.keywords,
        songData: result.songData
          ? {
              id: crypto.randomUUID?.() ?? `${Date.now()}`,
              type: 'song',
              createdAt: Date.now(),
              input: result.songData.input,
              stylePrompt: result.songData.stylePrompt,
              expandedProductionNotes: result.songData.expandedProductionNotes,
              lyricsAndStructure: result.songData.lyricsAndStructure,
              uniquenessStrategy: result.songData.uniquenessStrategy,
              draftPrompt: result.songData.draftPrompt,
              refinementPrompt: result.songData.refinementPrompt,
              finalSunoPrompt: result.songData.finalSunoPrompt,
              youtubeTitles: result.songData.youtubeTitles,
              youtubeDescription: result.songData.youtubeDescription,
              tagRequestPrompt: result.songData.tagRequestPrompt,
              contentIdWarning: result.songData.contentIdWarning,
            }
          : undefined,
      });
      setIsSaved(true);
      onSaved();
    } catch (err) {
      onError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.result}>
      <div className={styles.resultHeader}>
        <h3 className={styles.generatedTitle}>📝 {result.title}</h3>
        <div className={styles.keywords}>
          {result.keywords.map((kw) => (
            <Badge key={kw} color="primary">
              {kw}
            </Badge>
          ))}
        </div>
      </div>

      {/* 프롬프트 본문 */}
      <div className={styles.promptBox}>
        {result.songData ? (
          <div className={styles.songSections}>
            <section className={styles.songSection}>
              <h4>🎯 Style Prompt</h4>
              <pre className={styles.promptText}>{result.songData.stylePrompt}</pre>
            </section>

            <section className={styles.songSection}>
              <h4>🎚 Expanded Production Notes</h4>
              <pre className={styles.promptText}>{result.songData.expandedProductionNotes}</pre>
            </section>

            <section className={styles.songSection}>
              <h4>🧱 Lyrics & Structure</h4>
              <pre className={styles.promptText}>{result.songData.lyricsAndStructure}</pre>
            </section>

            <section className={styles.songSection}>
              <h4>🧭 Uniqueness Strategy</h4>
              <ul className={styles.songList}>
                {result.songData.uniquenessStrategy.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </section>

            <section className={styles.songSection}>
              <h4>🧩 내부 구조 초안</h4>
              <pre className={styles.promptText}>{result.songData.draftPrompt}</pre>
            </section>

            <section className={styles.songSection}>
              <h4>🛠 AI 정제 요청문</h4>
              <pre className={styles.promptText}>{result.songData.refinementPrompt}</pre>
            </section>

            <section className={styles.songSection}>
              <h4>🎵 Suno 확장 프롬프트</h4>
              <pre className={styles.promptText}>{result.songData.finalSunoPrompt}</pre>
            </section>

            <section className={styles.songSection}>
              <h4>🇰🇷 설명</h4>
              <p className={styles.songCopy}>{result.songData.descriptionKo}</p>
            </section>

            <section className={styles.songSection}>
              <h4>🛡️ Content ID 체크</h4>
              <ul className={styles.songList}>
                {result.songData.contentIdChecks.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </section>

            <section className={styles.songSection}>
              <h4>🚚 배포 안정성 체크</h4>
              <ul className={styles.songList}>
                {result.songData.distributionSafetyCheck.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </section>

            <section className={styles.songSection}>
              <h4>⚠️ Content ID 주의 문구</h4>
              <p className={styles.songCopy}>{result.songData.contentIdWarning}</p>
            </section>

            <section className={styles.songSection}>
              <h4>📺 유튜브 제목 추천</h4>
              <ol className={styles.songList}>
                {result.songData.youtubeTitles.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </section>

            <section className={styles.songSection}>
              <h4>📝 유튜브 설명 초안</h4>
              <pre className={styles.promptText}>{result.songData.youtubeDescription}</pre>
            </section>

            <section className={styles.songSection}>
              <h4>#️⃣ 태그 추천</h4>
              <p className={styles.songCopy}>{result.songData.tagRequestPrompt}</p>
            </section>

            <section className={styles.songSection}>
              <h4>✅ 음원 등록 전 체크리스트</h4>
              <ul className={styles.songList}>
                {result.songData.preReleaseChecklist.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </section>

            <section className={styles.songSection}>
              <h4>🏷️ 메타데이터 작성 주의사항</h4>
              <ul className={styles.songList}>
                {result.songData.metadataNamingCaution.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </section>
          </div>
        ) : (
          <pre className={styles.promptText}>{result.prompt}</pre>
        )}
      </div>

      {/* HTML 다운로드 패널 — includeHtml=true 시 표시 */}
      {result.includeHtml && (
        <div className={styles.htmlPanel}>
          <button
            type="button"
            className={styles.htmlPanelToggle}
            onClick={() => setShowHtmlPanel((v) => !v)}
          >
            📄 HTML 파일로 저장하기
            <span className={styles.htmlPanelChevron}>
              {showHtmlPanel ? '▲' : '▼'}
            </span>
          </button>

          {showHtmlPanel && (
            <div className={styles.htmlPanelBody}>
              <p className={styles.htmlGuide}>
                ① 위 프롬프트를 AI(ChatGPT·Claude 등)에 붙여넣고 HTML 결과를 받으세요.<br />
                ② AI가 생성한 HTML 전체를 아래에 붙여넣은 뒤 <strong>HTML 다운로드</strong> 버튼을 누르세요.
              </p>
              <textarea
                className={styles.htmlTextarea}
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                placeholder="AI가 생성한 HTML 코드를 여기에 붙여넣으세요..."
                rows={8}
                spellCheck={false}
              />
              <Button
                variant="secondary"
                size="md"
                onClick={handleHtmlDownload}
                type="button"
                fullWidth
              >
                ⬇️ HTML 파일 다운로드 (.html)
              </Button>
            </div>
          )}
        </div>
      )}

      {/* 발행 URL 입력 */}
      <div className={styles.saveSection}>
        <Input
          label="발행 URL (선택)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://blog.example.com/..."
          fullWidth
          disabled={isSaved}
        />
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" size="md" onClick={handleCopy} type="button">
          📋 프롬프트 복사
        </Button>
        <Button
          variant={isSaved ? 'ghost' : 'primary'}
          size="md"
          onClick={handleSave}
          disabled={isSaved}
          type="button"
        >
          {isSaved ? '✅ 저장 완료' : '💾 등록 목록에 저장'}
        </Button>
      </div>
    </div>
  );
};

export default PromptResult;
