import React, { useState } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Select from '@/components/common/Select';
import type { SongDraftForm as FormType, GeneratedPrompt } from '@/types';
import { generateSongPrompt } from '@/utils/promptGenerator';
import styles from './DraftForm.module.scss';

interface Props {
  onGenerated: (result: GeneratedPrompt) => void;
  onError: (msg: string) => void;
}

const MUSIC_PURPOSE_OPTIONS = [
  { value: 'youtube_focus', label: '유튜브 조회수형 / 공부·집중' },
  { value: 'cooking_bgm', label: '요리·브이로그 BGM' },
  { value: 'daily_listen', label: '일상에서 듣기 좋은 노래' },
  { value: 'emotional_playlist', label: '감성 플레이리스트' },
  { value: 'cafe_bgm', label: '카페·휴식 음악' },
  { value: 'shorts_bgm', label: '쇼츠·릴스용 짧은 음악' },
  { value: 'general_music', label: '그 외(기타)' },
];

const INSTRUMENT_OPTIONS = [
  { value: 'piano', label: '피아노' },
  { value: 'acoustic_guitar', label: '통기타' },
  { value: 'electric_guitar', label: '일렉 기타' },
  { value: 'lofi_keys', label: '로파이 건반' },
  { value: 'strings', label: '스트링' },
  { value: 'synth_pad', label: '신스 패드' },
  { value: 'jazz_piano', label: '재즈 피아노' },
  { value: 'mixed', label: 'AI 추천 믹스' },
];

const LANGUAGE_OPTIONS = [
  { value: '', label: 'AI 추천' },
  { value: 'Korean', label: 'Korean' },
  { value: 'English', label: 'English' },
  { value: 'Other', label: 'Other' },
];

const INITIAL_FORM: FormType = {
  purpose: 'youtube_focus',
  topic: '',
  mood: '',
  genre: '',
  tempo: '',
  instrument: 'mixed',
  songLength: 'full',
  gender: 'ai_recommend',
  includeLyrics: true,
  voiceStyle: '',
  languageOption: '',
  language: '',
  lyricStyle: '',
  keywords: '',
  extraNotes: '',
};

const SongDraftForm: React.FC<Props> = ({ onGenerated, onError }) => {
  const [form, setForm] = useState<FormType>(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.topic.trim()) {
      onError('주제를 입력해 주세요.');
      return;
    }

    setIsLoading(true);
    try {
      onGenerated(generateSongPrompt(form));
      setForm(INITIAL_FORM);
    } catch (error) {
      onError(error instanceof Error ? error.message : '노래 프롬프트 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formBody}>
      <div className={styles.infoBox}>
        <strong>노래 탭 안내</strong>
        <p>
          Suno AI에 바로 넣을 수 있는 음악 프롬프트와 유튜브 업로드용 제목, 설명, 태그를 함께 생성합니다.
          Content ID 충돌 가능성을 줄이기 위해 기존 곡과 아티스트 모방을 피하는 안전 문구가 자동으로 포함됩니다.
        </p>
      </div>

      <div className={styles.noticeBox}>
        <strong>Content ID 안정성 안내</strong>
        <p>
          이 도구는 기존 곡과 유사한 표현을 피하고, 오리지널 구성을 유도하는 문구를 자동으로 추가합니다.
          다만 AI 생성 음악 특성상 Content ID 충돌 가능성을 완전히 보장할 수는 없습니다.
          음원 유통 전에는 사용하는 플랫폼의 AI 음악 정책과 권리 조건을 꼭 확인해 주세요.
        </p>
      </div>

      <div className={styles.fieldRow}>
        <Select
          label="음악 목적"
          options={MUSIC_PURPOSE_OPTIONS}
          value={form.purpose}
          onChange={(e) => setForm((prev) => ({ ...prev, purpose: e.target.value as FormType['purpose'] }))}
          fullWidth
        />
      </div>

      <div className={styles.fieldRow}>
        <Input label="주제" value={form.topic} onChange={(e) => setForm((prev) => ({ ...prev, topic: e.target.value }))} placeholder="예: 비 오는 날, 퇴근길, 요리하는 아침" fullWidth />
        <Input label="분위기" value={form.mood} onChange={(e) => setForm((prev) => ({ ...prev, mood: e.target.value }))} placeholder="예: 따뜻함, 희망, 편안함" fullWidth />
      </div>

      <div className={styles.fieldRow}>
        <Input label="장르" value={form.genre} onChange={(e) => setForm((prev) => ({ ...prev, genre: e.target.value }))} placeholder="예: lofi, K-pop ballad, acoustic pop, cafe jazz, ambient" fullWidth />
        <Input label="템포" value={form.tempo} onChange={(e) => setForm((prev) => ({ ...prev, tempo: e.target.value }))} placeholder="예: 70-85 BPM, 느리게, 미디엄 템포" fullWidth />
      </div>

      <div className={styles.fieldRow}>
        <Select
          label="악기"
          options={INSTRUMENT_OPTIONS}
          value={form.instrument}
          onChange={(e) => setForm((prev) => ({ ...prev, instrument: e.target.value as FormType['instrument'] }))}
          fullWidth
        />
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
            { value: 'ai_recommend', label: 'AI 추천' },
          ].map((option) => (
            <label key={option.value} className={styles.radioLabel}>
              <input
                className={styles.radioInput}
                type="radio"
                name="song-gender"
                value={option.value}
                checked={form.gender === option.value}
                disabled={!form.includeLyrics}
                onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value as FormType['gender'] }))}
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
          placeholder="예: 부드럽게, 담백하게, 속삭이듯"
          fullWidth
          disabled={!form.includeLyrics}
        />
        <Input
          label="가사 스타일"
          value={form.lyricStyle}
          onChange={(e) => setForm((prev) => ({ ...prev, lyricStyle: e.target.value }))}
          placeholder="예: 일상적, 감성적, 쉬운 문장"
          fullWidth
          disabled={!form.includeLyrics}
        />
      </div>

      <div className={styles.fieldRow}>
        <Select
          label="언어 선택"
          options={LANGUAGE_OPTIONS}
          value={form.languageOption}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              languageOption: e.target.value as FormType['languageOption'],
              language: e.target.value === 'Korean' || e.target.value === 'English' ? e.target.value : prev.language,
            }))
          }
          fullWidth
          disabled={!form.includeLyrics}
        />
        <Input label="추가 키워드" value={form.keywords} onChange={(e) => setForm((prev) => ({ ...prev, keywords: e.target.value }))} placeholder="쉼표로 구분해 입력" fullWidth />
      </div>

      {form.includeLyrics && form.languageOption === 'Other' && (
        <div className={styles.fieldRow}>
          <Input
            label="기타 언어"
            value={form.language}
            onChange={(e) => setForm((prev) => ({ ...prev, language: e.target.value }))}
            placeholder="예: Japanese, Spanish, French"
            fullWidth
          />
        </div>
      )}

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
