import React, { useState } from 'react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import type { GeneratedPrompt } from '@/types';
import {
  CORE_EMOTION_OPTIONS,
  DISTRIBUTION_OPTIONS,
  DURATION_OPTIONS,
  MAIN_GENRE_OPTIONS,
  MODE_OPTIONS,
  OUTPUT_TYPE_OPTIONS,
  TEMPO_OPTIONS,
  TEXTURE_OPTIONS,
  VOCAL_GENDER_OPTIONS,
  VOCAL_STYLE_OPTIONS,
} from '@/features/musicPrompt/constants/options';
import { OptionCardGroup } from '@/features/musicPrompt/components/OptionCardGroup';
import { OptionPillGroup } from '@/features/musicPrompt/components/OptionPillGroup';
import { SingleSelectPillGroup } from '@/features/musicPrompt/components/SingleSelectPillGroup';
import { useMusicPromptBuilder } from '@/features/musicPrompt/hooks/useMusicPromptBuilder';
import styles from './DraftForm.module.scss';

interface Props {
  onGenerated: (result: GeneratedPrompt) => void;
  onError: (msg: string) => void;
}

const SongDraftForm: React.FC<Props> = ({ onGenerated, onError }) => {
  const { form, updateForm, setOutputType, toggleEmotion, setMainGenre, toggleTexture, build, reset } =
    useMusicPromptBuilder();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { error, result } = build();
      if (error || !result) {
        onError(error ?? '음악 프롬프트 생성 중 오류가 발생했습니다.');
        return;
      }
      onGenerated(result);
      reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formBody}>
      <div className={styles.infoBox}>
        <strong>AI 음악 프롬프트 워크플로우</strong>
        <p>
          긴 문장을 직접 쓰는 대신 핵심 감정, 장르, 질감만 고르면 내부적으로 확장과 충돌 제거를 거쳐
          Suno용 Style Prompt를 압축해 생성합니다.
        </p>
      </div>

      <div className={styles.noticeBox}>
        <strong>생성 원칙</strong>
        <p>
          메인 장르 1개, 감정 최대 2개, 질감 최대 3개만 받아 과한 조합을 줄입니다.
          최종 프롬프트는 짧고 강하게 압축되며, 유통과 Content ID 리스크를 낮추는 문구가 함께 반영됩니다.
        </p>
      </div>

      <div className={styles.fieldRow}>
        <span>결과물 유형</span>
        <OptionCardGroup options={OUTPUT_TYPE_OPTIONS} value={form.outputType} onChange={setOutputType} />
      </div>

      <div className={styles.fieldRow}>
        <span>길이 목표</span>
        <SingleSelectPillGroup
          options={DURATION_OPTIONS}
          value={form.durationTarget}
          onChange={(value) => updateForm('durationTarget', value)}
        />
      </div>

      <div className={styles.fieldRow}>
        <span>배포 의도</span>
        <SingleSelectPillGroup
          options={DISTRIBUTION_OPTIONS}
          value={form.distributionIntent}
          onChange={(value) => updateForm('distributionIntent', value)}
        />
      </div>

      <div className={styles.fieldRow}>
        <Input
          label="주제"
          value={form.topic}
          onChange={(event) => updateForm('topic', event.target.value)}
          placeholder="예: 비 오는 날 통기타, 중독성 강한 숏츠 팝, 새벽 빗소리 카페"
          fullWidth
        />
      </div>

      <div className={styles.fieldRow}>
        <span>핵심 감정 (최대 2개)</span>
        <OptionPillGroup options={CORE_EMOTION_OPTIONS} values={form.coreEmotions} onToggle={toggleEmotion} />
      </div>

      <div className={styles.fieldRow}>
        <span>메인 장르</span>
        <SingleSelectPillGroup options={MAIN_GENRE_OPTIONS} value={form.mainGenre} onChange={setMainGenre} />
      </div>

      <div className={styles.fieldRow}>
        <span>Texture / 사운드 질감 (최대 3개)</span>
        <OptionPillGroup options={TEXTURE_OPTIONS} values={form.textures} onToggle={toggleTexture} />
      </div>

      <div className={styles.fieldRow}>
        <span>보컬 스타일</span>
        <SingleSelectPillGroup
          options={VOCAL_STYLE_OPTIONS}
          value={form.vocalStyle}
          onChange={(value) => updateForm('vocalStyle', value)}
        />
      </div>

      <div className={styles.fieldRow}>
        <span>템포</span>
        <SingleSelectPillGroup
          options={TEMPO_OPTIONS.map((option) => ({
            value: option.value,
            label: `${option.label} (${option.bpm})`,
          }))}
          value={form.tempoRange}
          onChange={(value) => updateForm('tempoRange', value)}
        />
      </div>

      <div className={styles.fieldRow}>
        <span>생성 모드</span>
        <OptionCardGroup
          options={MODE_OPTIONS}
          value={form.generationMode}
          onChange={(value) => updateForm('generationMode', value)}
        />
      </div>

      <div className={styles.fieldRow}>
        <span>보컬 성별</span>
        <SingleSelectPillGroup
          options={VOCAL_GENDER_OPTIONS}
          value={form.gender}
          onChange={(value) => updateForm('gender', value)}
        />
      </div>

      <div className={styles.fieldRow}>
        <Input
          label="세계관 / 분위기"
          value={form.worldbuilding}
          onChange={(event) => updateForm('worldbuilding', event.target.value)}
          placeholder="예: rainy rooftop city, quiet midnight cafe, empty runway after war"
          fullWidth
        />
      </div>

      <div className={styles.fieldRow}>
        <Input
          label="추가 키워드"
          value={form.keywords}
          onChange={(event) => updateForm('keywords', event.target.value)}
          placeholder="예: syncopation, vinyl crackle, hook-first"
          fullWidth
        />
      </div>

      <div className={styles.fieldRow}>
        <span>기타 설명</span>
        <textarea
          className={styles.textarea}
          value={form.extraNotes}
          onChange={(event) => updateForm('extraNotes', event.target.value)}
          placeholder="예: 첫 1초 안에 훅이 들어왔으면 좋겠고, 멜로디보다는 리듬 후크가 기억에 남았으면 좋겠음"
        />
      </div>

      <Button onClick={handleSubmit} loading={isLoading} fullWidth size="lg" type="button">
        Style Prompt 생성
      </Button>
    </div>
  );
};

export default SongDraftForm;
