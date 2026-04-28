import React, { useState } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Select from '@/components/common/Select';
import type { VideoDraftForm as FormType, GeneratedPrompt } from '@/types';
import { generateVideoPrompt } from '@/utils/promptGenerator';
import styles from './DraftForm.module.scss';

interface Props {
  onGenerated: (result: GeneratedPrompt) => void;
  onError: (msg: string) => void;
}

const PURPOSE_OPTIONS = [
  { value: 'shorts', label: '쇼츠' },
  { value: 'movie_trailer', label: '영화 예고편' },
  { value: 'game_trailer', label: '게임 트레일러' },
  { value: 'product_promo', label: '제품 홍보' },
  { value: 'portrait', label: '인물 포트레이트' },
];

const BACKGROUND_OPTIONS = [
  { value: 'mountain', label: '산악 지형' },
  { value: 'city', label: '도시' },
  { value: 'forest', label: '숲' },
  { value: 'space', label: '우주' },
  { value: 'ocean', label: '바다' },
  { value: 'indoor', label: '실내' },
  { value: 'custom', label: '직접 입력' },
];

const MOOD_OPTIONS = [
  { value: 'epic', label: '웅장함' },
  { value: 'dark', label: '다크' },
  { value: 'emotional', label: '감성적' },
  { value: 'tense', label: '긴장감' },
  { value: 'futuristic', label: '미래적' },
  { value: 'calm', label: '차분함' },
];

const LENGTH_OPTIONS = [
  { value: '5s', label: '5초' },
  { value: '8s', label: '8초' },
  { value: '15s', label: '15초' },
  { value: '30s', label: '30초' },
];

const ACTION_OPTIONS = [
  { value: 'intro_appearance', label: '등장 / 시작 장면' },
  { value: 'movement', label: '이동 / 접근' },
  { value: 'main_action', label: '주요 행동' },
  { value: 'emotion_shift', label: '감정 변화' },
  { value: 'close_up', label: '클로즈업' },
  { value: 'scene_transition', label: '장면 전환' },
  { value: 'finale', label: '피날레 / 마무리' },
  { value: 'product_highlight', label: '제품 강조' },
  { value: 'background_highlight', label: '배경 강조' },
  { value: 'slow_motion', label: '슬로우 모션' },
  { value: 'camera_rotation', label: '카메라 회전' },
  { value: 'detail_cut', label: '디테일 컷' },
];

const CAMERA_OPTIONS = [
  { value: 'continuous_shot', label: 'continuous shot' },
  { value: 'handheld_cinematic', label: 'handheld cinematic' },
  { value: 'tracking_shot', label: 'tracking shot' },
  { value: 'drone_wide', label: 'drone wide' },
  { value: 'close_up', label: 'close-up' },
];

const PRESET_OPTIONS = [
  { value: '', label: '프리셋 선택 안 함' },
  { value: 'action_hero', label: '액션 히어로' },
  { value: 'emotional_portrait', label: '감성 인물 포트레이트' },
  { value: 'product_ad', label: '제품 광고' },
  { value: 'travel_cinematic', label: '여행 시네마틱' },
  { value: 'food_video', label: '음식 영상' },
  { value: 'fashion_lookbook', label: '패션 룩북' },
  { value: 'game_trailer', label: '게임 트레일러' },
  { value: 'history_documentary', label: '역사 다큐멘터리' },
  { value: 'animation_style', label: '애니메이션 스타일' },
  { value: 'shorts_viral', label: '쇼츠 바이럴' },
];

const INITIAL_FORM: FormType = {
  purpose: 'shorts',
  useReferenceImage: false,
  characterDescription: '',
  background: 'custom',
  customBackground: '',
  mood: 'calm',
  actions: [],
  cameraStyles: [],
  length: '8s',
  dialogueMode: 'none',
  dialogue: '',
  extraRequest: '',
  physicsBoost: false,
  objectVisibility: false,
  identityLock: false,
  cameraContinuity: false,
  errorPrevention: false,
  styleConsistency: false,
  backgroundConsistency: false,
};

const PRESETS: Record<string, FormType> = {
  action_hero: {
  purpose: 'movie_trailer',
  useReferenceImage: true,
  characterDescription: 'powerful action hero with a bold silhouette and cinematic presence',
  background: 'custom',
  customBackground: 'dramatic glowing volcanic terrain',
  mood: 'epic',
  actions: ['intro_appearance', 'movement', 'main_action', 'slow_motion', 'camera_rotation', 'finale'],
  cameraStyles: ['continuous_shot', 'handheld_cinematic', 'tracking_shot'],
  length: '15s',
  dialogueMode: 'none',
  dialogue: '',
  extraRequest: '',
  physicsBoost: true,
  objectVisibility: true,
  identityLock: true,
  cameraContinuity: true,
  errorPrevention: true,
  styleConsistency: true,
  backgroundConsistency: true,
  },
  emotional_portrait: {
    ...INITIAL_FORM,
    purpose: 'portrait',
    characterDescription: 'soft emotional portrait subject with expressive eyes',
    background: 'indoor',
    mood: 'emotional',
    actions: ['intro_appearance', 'emotion_shift', 'close_up', 'detail_cut', 'finale'],
    cameraStyles: ['close_up', 'handheld_cinematic'],
  },
  product_ad: {
    ...INITIAL_FORM,
    purpose: 'product_promo',
    characterDescription: 'sleek premium product hero object',
    background: 'indoor',
    mood: 'futuristic',
    actions: ['intro_appearance', 'product_highlight', 'detail_cut', 'scene_transition', 'finale'],
    cameraStyles: ['tracking_shot', 'close_up'],
  },
  travel_cinematic: {
    ...INITIAL_FORM,
    purpose: 'shorts',
    characterDescription: 'traveler moving through scenic landmarks',
    background: 'mountain',
    mood: 'epic',
    actions: ['intro_appearance', 'movement', 'background_highlight', 'slow_motion', 'finale'],
    cameraStyles: ['drone_wide', 'tracking_shot'],
  },
  food_video: {
    ...INITIAL_FORM,
    purpose: 'product_promo',
    characterDescription: 'chef hands and plated food as the main subject',
    background: 'indoor',
    mood: 'calm',
    actions: ['intro_appearance', 'detail_cut', 'product_highlight', 'close_up', 'finale'],
    cameraStyles: ['close_up', 'tracking_shot'],
  },
  fashion_lookbook: {
    ...INITIAL_FORM,
    purpose: 'portrait',
    characterDescription: 'fashion model showcasing a modern outfit',
    background: 'city',
    mood: 'futuristic',
    actions: ['intro_appearance', 'movement', 'detail_cut', 'camera_rotation', 'finale'],
    cameraStyles: ['tracking_shot', 'close_up'],
  },
  game_trailer: {
    ...INITIAL_FORM,
    purpose: 'game_trailer',
    characterDescription: 'game protagonist in a high-stakes cinematic world',
    background: 'space',
    mood: 'tense',
    actions: ['intro_appearance', 'movement', 'main_action', 'scene_transition', 'finale'],
    cameraStyles: ['continuous_shot', 'drone_wide', 'tracking_shot'],
  },
  history_documentary: {
    ...INITIAL_FORM,
    purpose: 'movie_trailer',
    characterDescription: 'historical figure or symbolic documentary subject',
    background: 'custom',
    customBackground: 'realistic historical location',
    mood: 'dark',
    actions: ['intro_appearance', 'background_highlight', 'detail_cut', 'emotion_shift', 'finale'],
    cameraStyles: ['close_up', 'tracking_shot'],
  },
  animation_style: {
    ...INITIAL_FORM,
    purpose: 'shorts',
    characterDescription: 'stylized animated protagonist with strong silhouette',
    background: 'custom',
    customBackground: 'stylized animated environment',
    mood: 'futuristic',
    actions: ['intro_appearance', 'movement', 'main_action', 'scene_transition', 'finale'],
    cameraStyles: ['continuous_shot', 'close_up'],
  },
  shorts_viral: {
    ...INITIAL_FORM,
    purpose: 'shorts',
    characterDescription: 'highly readable viral short-form subject',
    background: 'city',
    mood: 'epic',
    actions: ['intro_appearance', 'main_action', 'close_up', 'scene_transition', 'finale'],
    cameraStyles: ['continuous_shot', 'close_up'],
    length: '5s',
  },
};

const VideoDraftForm: React.FC<Props> = ({ onGenerated, onError }) => {
  const [form, setForm] = useState<FormType>(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [preset, setPreset] = useState('');

  const toggleAction = (value: FormType['actions'][number]) => {
    setForm((prev) => ({
      ...prev,
      actions: prev.actions.includes(value)
        ? prev.actions.filter((item) => item !== value)
        : [...prev.actions, value],
    }));
  };

  const toggleCamera = (value: FormType['cameraStyles'][number]) => {
    setForm((prev) => ({
      ...prev,
      cameraStyles: prev.cameraStyles.includes(value)
        ? prev.cameraStyles.filter((item) => item !== value)
        : [...prev.cameraStyles, value],
    }));
  };

  const handleSubmit = async () => {
    if (!form.characterDescription.trim()) {
      onError('캐릭터 설명을 입력해 주세요.');
      return;
    }

    setIsLoading(true);
    try {
      onGenerated(generateVideoPrompt(form));
    } catch (error) {
      onError(error instanceof Error ? error.message : '영상 프롬프트 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formBody}>
      <div className={styles.infoBox}>
        <strong>영상 탭 안내</strong>
        <p>
          배경, 캐릭터, 액션, 카메라, 길이, 안정화 옵션을 조합해서 AI 영상 생성용 영어 프롬프트 초안을 만듭니다.
          결과는 초안 프롬프트, 시퀀스 프롬프트, Shot 구성까지 한 번에 정리됩니다.
        </p>
      </div>

      <div className={styles.fieldRow}>
        <Select
          label="프리셋"
          options={PRESET_OPTIONS}
          value={preset}
          onChange={(e) => setPreset(e.target.value)}
          fullWidth
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            if (!preset) {
              setForm(INITIAL_FORM);
              return;
            }
            setForm(PRESETS[preset]);
          }}
        >
          🎛️ 프리셋 적용
        </Button>
      </div>

      <div className={styles.fieldRow}>
        <Select
          label="영상 목적"
          options={PURPOSE_OPTIONS}
          value={form.purpose}
          onChange={(e) => setForm((prev) => ({ ...prev, purpose: e.target.value as FormType['purpose'] }))}
          fullWidth
        />
      </div>

      <div className={styles.fieldRow}>
        <span>레퍼런스 이미지 사용 여부</span>
        <div className={styles.radioGroup}>
          {[
            { value: 'yes', label: '사용' },
            { value: 'no', label: '미사용' },
          ].map((option) => (
            <label key={option.value} className={styles.radioLabel}>
              <input
                className={styles.radioInput}
                type="radio"
                name="video-reference-image"
                checked={form.useReferenceImage === (option.value === 'yes')}
                onChange={() => setForm((prev) => ({ ...prev, useReferenceImage: option.value === 'yes' }))}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.fieldRow}>
        <Input
          label="주인공 / 피사체 설명"
          value={form.characterDescription}
          onChange={(e) => setForm((prev) => ({ ...prev, characterDescription: e.target.value }))}
          placeholder="예: female explorer, premium perfume bottle, documentary narrator"
          fullWidth
        />
      </div>

      <div className={styles.fieldRow}>
        <Select
          label="배경"
          options={BACKGROUND_OPTIONS}
          value={form.background}
          onChange={(e) => setForm((prev) => ({ ...prev, background: e.target.value as FormType['background'] }))}
          fullWidth
        />
      </div>

      {form.background === 'custom' && (
        <div className={styles.fieldRow}>
          <Input
            label="직접 입력 배경"
            value={form.customBackground}
            onChange={(e) => setForm((prev) => ({ ...prev, customBackground: e.target.value }))}
            placeholder="예: glowing volcanic terrain"
            fullWidth
          />
        </div>
      )}

      <div className={styles.fieldRow}>
        <Select
          label="분위기"
          options={MOOD_OPTIONS}
          value={form.mood}
          onChange={(e) => setForm((prev) => ({ ...prev, mood: e.target.value as FormType['mood'] }))}
          fullWidth
        />
      </div>

      <div className={styles.fieldRow}>
        <span>액션 흐름</span>
        <div className={styles.checkboxGroup}>
          {ACTION_OPTIONS.map((option) => (
            <label key={option.value} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.actions.includes(option.value as FormType['actions'][number])}
                onChange={() => toggleAction(option.value as FormType['actions'][number])}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.fieldRow}>
        <span>카메라 스타일</span>
        <div className={styles.checkboxGroup}>
          {CAMERA_OPTIONS.map((option) => (
            <label key={option.value} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.cameraStyles.includes(option.value as FormType['cameraStyles'][number])}
                onChange={() => toggleCamera(option.value as FormType['cameraStyles'][number])}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.fieldRow}>
        <Select
          label="영상 길이"
          options={LENGTH_OPTIONS}
          value={form.length}
          onChange={(e) => setForm((prev) => ({ ...prev, length: e.target.value as FormType['length'] }))}
          fullWidth
        />
      </div>

      <div className={styles.fieldRow}>
        <span>대사 여부</span>
        <div className={styles.radioGroup}>
          {[
            { value: 'none', label: '없음' },
            { value: 'custom', label: '직접 입력' },
          ].map((option) => (
            <label key={option.value} className={styles.radioLabel}>
              <input
                className={styles.radioInput}
                type="radio"
                name="video-dialogue-mode"
                checked={form.dialogueMode === option.value}
                onChange={() => setForm((prev) => ({ ...prev, dialogueMode: option.value as FormType['dialogueMode'] }))}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {form.dialogueMode === 'custom' && (
        <div className={styles.fieldRow}>
          <Input
            label="대사 입력"
            value={form.dialogue}
            onChange={(e) => setForm((prev) => ({ ...prev, dialogue: e.target.value }))}
            placeholder="예: This is where it ends."
            fullWidth
          />
        </div>
      )}

      <div className={styles.fieldRow}>
        <span>고급 옵션</span>
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={form.physicsBoost}
              onChange={(e) => setForm((prev) => ({ ...prev, physicsBoost: e.target.checked }))}
            />
            <span>물리감 강화</span>
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={form.objectVisibility}
              onChange={(e) => setForm((prev) => ({ ...prev, objectVisibility: e.target.checked }))}
            />
            <span>객체 이동 가시화</span>
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={form.identityLock}
              onChange={(e) => setForm((prev) => ({ ...prev, identityLock: e.target.checked }))}
            />
            <span>피사체 일관성 유지</span>
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={form.cameraContinuity}
              onChange={(e) => setForm((prev) => ({ ...prev, cameraContinuity: e.target.checked }))}
            />
            <span>카메라 연속성</span>
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={form.errorPrevention}
              onChange={(e) => setForm((prev) => ({ ...prev, errorPrevention: e.target.checked }))}
            />
            <span>얼굴/신체 왜곡 방지</span>
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={form.styleConsistency}
              onChange={(e) => setForm((prev) => ({ ...prev, styleConsistency: e.target.checked }))}
            />
            <span>스타일 일관성 유지</span>
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={form.backgroundConsistency}
              onChange={(e) => setForm((prev) => ({ ...prev, backgroundConsistency: e.target.checked }))}
            />
            <span>배경 일관성 유지</span>
          </label>
        </div>
      </div>

      <div className={styles.fieldRow}>
        <span>추가 요청사항</span>
        <textarea
          className={styles.textarea}
          value={form.extraRequest}
          onChange={(e) => setForm((prev) => ({ ...prev, extraRequest: e.target.value }))}
          placeholder="추가 연출, 속도감, 조명, 색감 등 필요한 요청을 자유롭게 적어 주세요."
        />
      </div>

      <Button onClick={handleSubmit} loading={isLoading} fullWidth size="lg" type="button">
        🎬 프롬프트 생성
      </Button>
    </div>
  );
};

export default VideoDraftForm;
