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

const OUTPUT_TYPE_OPTIONS = [
  { value: 'song', label: '일반 노래' },
  { value: 'hook_short', label: '숏츠/릴스 훅' },
  { value: 'instrumental', label: '연주/BGM' },
  { value: 'ambience_asmr', label: 'ASMR/환경음' },
];

const DURATION_OPTIONS = [
  { value: 'auto', label: 'AI 추천' },
  { value: 'd15', label: '15초' },
  { value: 'd30', label: '30초' },
  { value: 'd60', label: '1분' },
  { value: 'd180', label: '3분' },
  { value: 'd210', label: '3분 30초' },
];

const DISTRIBUTION_OPTIONS = [
  { value: 'social_only', label: 'SNS 업로드 전용' },
  { value: 'release_only', label: '음원 등록 전용' },
  { value: 'social_and_release', label: 'SNS + 음원 등록' },
];

const VERSION_OPTIONS = [
  { value: 'original', label: '원곡 버전' },
  { value: 'short_edit', label: '숏폼 편집 버전' },
  { value: 'instrumental', label: '연주 버전' },
  { value: 'acoustic', label: '어쿠스틱 버전' },
  { value: 'ambient', label: '앰비언트 버전' },
];

const INSTRUMENT_OPTIONS = [
  { value: 'piano', label: '피아노' },
  { value: 'acoustic_guitar', label: '통기타' },
  { value: 'electric_guitar', label: '일렉 기타' },
  { value: 'lofi_keys', label: '로파이 건반' },
  { value: 'strings', label: '스트링' },
  { value: 'synth_pad', label: '신스 패드' },
  { value: 'jazz_piano', label: '재즈 피아노' },
  { value: 'ai_recommend_single', label: '요청에 맞게 AI 추천' },
  { value: 'mixed', label: 'AI 추천 믹스' },
];

const LANGUAGE_OPTIONS = [
  { value: '', label: 'AI 추천' },
  { value: 'Korean', label: 'Korean' },
  { value: 'English', label: 'English' },
  { value: 'Other', label: 'Other' },
];

const LYRIC_DENSITY_OPTIONS = [
  { value: 'minimal', label: '최소' },
  { value: 'balanced', label: '균형' },
  { value: 'dense', label: '촘촘함' },
];

const INITIAL_FORM: FormType = {
  purpose: 'youtube_focus',
  outputType: 'song',
  durationTarget: 'auto',
  distributionIntent: 'social_only',
  versionType: 'original',
  vocalMode: 'with_lyrics',
  topic: '',
  mood: '',
  genre: '',
  tempo: '',
  instrument: 'mixed',
  gender: 'ai_recommend',
  hookStrength: 'medium',
  loopMode: 'natural_ending',
  voiceStyle: '',
  languageOption: '',
  language: '',
  lyricStyle: '',
  lyricDensity: 'balanced',
  keywords: '',
  extraNotes: '',
};

const SongDraftForm: React.FC<Props> = ({ onGenerated, onError }) => {
  const [form, setForm] = useState<FormType>(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);

  const lyricsEnabled =
    form.vocalMode === 'with_lyrics' || form.vocalMode === 'vocalize_only';
  const vocalsEnabled = form.vocalMode !== 'instrumental_only' && form.vocalMode !== 'ambience_only';
  const ambienceMode = form.outputType === 'ambience_asmr' || form.vocalMode === 'ambience_only';

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
          단순한 Suno 문장 생성이 아니라, 구조화 초안부터 AI 정제 요청문, 최종 Suno 프롬프트,
          유튜브 메타데이터, 배포 안정성 체크까지 한 번에 생성합니다.
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
          label="결과물 유형"
          options={OUTPUT_TYPE_OPTIONS}
          value={form.outputType}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              outputType: e.target.value as FormType['outputType'],
              vocalMode:
                e.target.value === 'ambience_asmr'
                  ? 'ambience_only'
                  : e.target.value === 'instrumental'
                    ? 'instrumental_only'
                    : prev.vocalMode,
            }))
          }
          fullWidth
        />
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
        <Select
          label="길이 목표"
          options={DURATION_OPTIONS}
          value={form.durationTarget}
          onChange={(e) => setForm((prev) => ({ ...prev, durationTarget: e.target.value as FormType['durationTarget'] }))}
          fullWidth
        />
        <Select
          label="배포 의도"
          options={DISTRIBUTION_OPTIONS}
          value={form.distributionIntent}
          onChange={(e) => setForm((prev) => ({ ...prev, distributionIntent: e.target.value as FormType['distributionIntent'] }))}
          fullWidth
        />
      </div>

      <div className={styles.fieldRow}>
        <Select
          label="버전 타입"
          options={VERSION_OPTIONS}
          value={form.versionType}
          onChange={(e) => setForm((prev) => ({ ...prev, versionType: e.target.value as FormType['versionType'] }))}
          fullWidth
        />
        <Input label="주제" value={form.topic} onChange={(e) => setForm((prev) => ({ ...prev, topic: e.target.value }))} placeholder="예: 비 오는 날, 퇴근길, 요리하는 아침" fullWidth />
        <Input label="분위기" value={form.mood} onChange={(e) => setForm((prev) => ({ ...prev, mood: e.target.value }))} placeholder="예: 따뜻함, 희망, 편안함, 고요함" fullWidth />
      </div>

      <div className={styles.fieldRow}>
        <Input label="장르" value={form.genre} onChange={(e) => setForm((prev) => ({ ...prev, genre: e.target.value }))} placeholder="예: lofi, acoustic pop, cafe jazz, ambient rain" fullWidth />
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
        <span>보컬/사운드 방식</span>
        <div className={styles.radioGroup}>
          {[
            { value: 'with_lyrics', label: '가사 포함' },
            { value: 'vocalize_only', label: '허밍/보컬라이즈' },
            { value: 'instrumental_only', label: '무보컬 연주' },
            { value: 'ambience_only', label: '환경음 전용' },
          ].map((option) => (
            <label key={option.value} className={styles.radioLabel}>
              <input
                className={styles.radioInput}
                type="radio"
                name="song-vocal-mode"
                value={option.value}
                checked={form.vocalMode === option.value}
                onChange={() =>
                  setForm((prev) => ({
                    ...prev,
                    vocalMode: option.value as FormType['vocalMode'],
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
        <div className={`${styles.radioGroup} ${!vocalsEnabled ? styles.disabledGroup : ''}`}>
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
                disabled={!vocalsEnabled}
                onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value as FormType['gender'] }))}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.fieldRow}>
        <span>훅 강도</span>
        <div className={`${styles.radioGroup} ${form.outputType !== 'hook_short' ? styles.disabledGroup : ''}`}>
          {[
            { value: 'low', label: '낮음' },
            { value: 'medium', label: '보통' },
            { value: 'high', label: '강함' },
          ].map((option) => (
            <label key={option.value} className={styles.radioLabel}>
              <input
                className={styles.radioInput}
                type="radio"
                name="song-hook-strength"
                value={option.value}
                checked={form.hookStrength === option.value}
                disabled={form.outputType !== 'hook_short'}
                onChange={(e) => setForm((prev) => ({ ...prev, hookStrength: e.target.value as FormType['hookStrength'] }))}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.fieldRow}>
        <span>마무리 방식</span>
        <div className={styles.radioGroup}>
          {[
            { value: 'loopable', label: '루프형' },
            { value: 'natural_ending', label: '자연 종료형' },
          ].map((option) => (
            <label key={option.value} className={styles.radioLabel}>
              <input
                className={styles.radioInput}
                type="radio"
                name="song-loop-mode"
                value={option.value}
                checked={form.loopMode === option.value}
                onChange={(e) => setForm((prev) => ({ ...prev, loopMode: e.target.value as FormType['loopMode'] }))}
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
          disabled={!vocalsEnabled}
        />
        <Input
          label="가사 스타일"
          value={form.lyricStyle}
          onChange={(e) => setForm((prev) => ({ ...prev, lyricStyle: e.target.value }))}
          placeholder="예: 일상적, 감성적, 쉬운 문장"
          fullWidth
          disabled={!lyricsEnabled}
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
            disabled={!vocalsEnabled}
          />
        <Select
          label="가사 밀도"
          options={LYRIC_DENSITY_OPTIONS}
          value={form.lyricDensity}
          onChange={(e) => setForm((prev) => ({ ...prev, lyricDensity: e.target.value as FormType['lyricDensity'] }))}
          fullWidth
          disabled={!lyricsEnabled}
        />
      </div>

      <div className={styles.fieldRow}>
        <Input label="추가 키워드" value={form.keywords} onChange={(e) => setForm((prev) => ({ ...prev, keywords: e.target.value }))} placeholder="쉼표로 구분해 입력" fullWidth />
      </div>

      {vocalsEnabled && form.languageOption === 'Other' && (
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
          placeholder={
            ambienceMode
              ? '예: 빗소리와 카페 컵 소리 중심, 멜로디 없음, 조용한 새벽 느낌'
              : '예: 첫 1초 훅 강조, 통기타 피크 긁는 소리, 후렴 반복, 브이로그 편집 친화적'
          }
        />
      </div>

      <Button onClick={handleSubmit} loading={isLoading} fullWidth size="lg" type="button">
        🎵 프롬프트 생성
      </Button>
    </div>
  );
};

export default SongDraftForm;
