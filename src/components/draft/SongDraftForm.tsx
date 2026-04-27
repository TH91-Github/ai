import React, { useState } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import type { SongDraftForm as FormType, GeneratedPrompt } from '@/types';
import { generateSongPrompt } from '@/utils/promptGenerator';
import styles from './DraftForm.module.scss';

interface Props {
  onGenerated: (result: GeneratedPrompt) => void;
  onError: (msg: string) => void;
}

const SongDraftForm: React.FC<Props> = ({ onGenerated, onError }) => {
  const [form, setForm] = useState<FormType>({
    topic: '',
    emotion: '',
    genre: '',
    tempo: '',
    gender: 'auto',
    includeLyrics: true,
    voiceStyle: '',
    language: '',
    lyricStyle: '',
    keywords: '',
    extraNotes: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.topic.trim()) {
      onError('주제를 입력해 주세요.');
      return;
    }

    setIsLoading(true);
    try {
      onGenerated(generateSongPrompt(form));
    } catch (error) {
      onError(error instanceof Error ? error.message : '노래 프롬프트 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formBody}>
      <div className={styles.fieldRow}>
        <Input label="주제" value={form.topic} onChange={(e) => setForm((prev) => ({ ...prev, topic: e.target.value }))} placeholder="예: 비 오는 밤의 그리움" fullWidth />
        <Input label="감정" value={form.emotion} onChange={(e) => setForm((prev) => ({ ...prev, emotion: e.target.value }))} placeholder="예: 아련함, 희망" fullWidth />
      </div>

      <div className={styles.fieldRow}>
        <Input label="장르" value={form.genre} onChange={(e) => setForm((prev) => ({ ...prev, genre: e.target.value }))} placeholder="예: K-pop ballad" fullWidth />
        <Input label="템포" value={form.tempo} onChange={(e) => setForm((prev) => ({ ...prev, tempo: e.target.value }))} placeholder="예: 느리게, 78 BPM" fullWidth />
      </div>

      <div className={styles.fieldRow}>
        <span>가사</span>
        <div className={styles.radioGroup}>
          {[
            { value: 'yes', label: '가사 있음' },
            { value: 'no', label: '가사 없음' },
          ].map((option) => (
            <label key={option.value} className={styles.radioLabel}>
              <input
                className={styles.radioInput}
                type="radio"
                name="song-lyrics"
                value={option.value}
                checked={form.includeLyrics === (option.value === 'yes')}
                onChange={() =>
                  setForm((prev) => ({
                    ...prev,
                    includeLyrics: option.value === 'yes',
                  }))
                }
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.fieldRow}>
        <span>보컬 성별</span>
        <div className={`${styles.radioGroup} ${!form.includeLyrics ? styles.disabledGroup : ''}`}>
          {[
            { value: 'female', label: '여성' },
            { value: 'male', label: '남성' },
            { value: 'mixed', label: '혼성' },
            { value: 'auto', label: 'AI 추천' },
          ].map((option) => (
            <label key={option.value} className={styles.radioLabel}>
              <input
                className={styles.radioInput}
                type="radio"
                name="song-gender"
                value={option.value}
                checked={form.gender === option.value}
                disabled={!form.includeLyrics}
                onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value }))}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      

      <div className={styles.fieldRow}>
        <Input
          label="보컬 스타일"
          value={form.voiceStyle}
          onChange={(e) => setForm((prev) => ({ ...prev, voiceStyle: e.target.value }))}
          placeholder="예: clear, emotional"
          fullWidth
          disabled={!form.includeLyrics}
        />
        <Input
          label="가사 스타일"
          value={form.lyricStyle}
          onChange={(e) => setForm((prev) => ({ ...prev, lyricStyle: e.target.value }))}
          placeholder="예: lyrical, memorable"
          fullWidth
          disabled={!form.includeLyrics}
        />
      </div>

      <div className={styles.fieldRow}>
        <Input
          label="언어"
          value={form.language}
          onChange={(e) => setForm((prev) => ({ ...prev, language: e.target.value }))}
          placeholder="예: 한국어, English, 日本語 (비워두면 AI 추천)"
          fullWidth
          disabled={!form.includeLyrics}
        />
        <Input label="추가 키워드" value={form.keywords} onChange={(e) => setForm((prev) => ({ ...prev, keywords: e.target.value }))} placeholder="쉼표로 구분해 입력" fullWidth />
      </div>

      <div className={styles.fieldRow}>
        <span>기타</span>
        <textarea
          className={styles.textarea}
          value={form.extraNotes}
          onChange={(e) => setForm((prev) => ({ ...prev, extraNotes: e.target.value }))}
          placeholder="감정, 장르, 보컬 느낌, 참고하고 싶은 방향을 자유롭게 설명해 주세요. 이 내용이 있으면 위 입력값보다 우선해서 반영합니다."
        />
      </div>

      <Button onClick={handleSubmit} loading={isLoading} fullWidth size="lg" type="button">
        🎵 프롬프트 생성
      </Button>
    </div>
  );
};

export default SongDraftForm;
