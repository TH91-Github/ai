import { useState } from 'react';
import {
  OUTPUT_TYPE_OPTIONS,
  PURPOSE_BY_OUTPUT,
  VERSION_BY_OUTPUT,
  VOCAL_MODE_BY_OUTPUT,
} from '@/features/musicPrompt/constants/options';
import type {
  CoreEmotion,
  MainGenre,
  MusicPromptFormValues,
  TextureOption,
} from '@/features/musicPrompt/types';
import { generateMusicPrompt } from '@/features/musicPrompt/utils/generateMusicPrompt';
import { validateMusicPrompt } from '@/features/musicPrompt/utils/validateMusicPrompt';

const DURATION_BY_OUTPUT: Record<MusicPromptFormValues['outputType'], MusicPromptFormValues['durationTarget']> = {
  song: 'd180',
  hook_short: 'd60',
  instrumental: 'd180',
};

export const INITIAL_MUSIC_PROMPT_FORM: MusicPromptFormValues = {
  purpose: PURPOSE_BY_OUTPUT.song,
  outputType: OUTPUT_TYPE_OPTIONS[0].value,
  durationTarget: DURATION_BY_OUTPUT.song,
  distributionIntent: 'social_and_release',
  versionType: VERSION_BY_OUTPUT.song,
  vocalMode: VOCAL_MODE_BY_OUTPUT.song,
  coreEmotions: ['ai_recommend'],
  mainGenre: 'ai_recommend',
  textures: ['ai_recommend'],
  vocalStyle: 'ai_recommend',
  tempoRange: 'ai_recommend',
  worldbuilding: '',
  generationMode: 'safe',
  topic: '',
  instrument: 'ai_recommend_single',
  gender: 'ai_recommend',
  languageOption: 'Korean',
  language: 'Korean',
  lyricDensity: 'balanced',
  keywords: '',
  extraNotes: '',
};

export const useMusicPromptBuilder = () => {
  const [form, setForm] = useState<MusicPromptFormValues>(INITIAL_MUSIC_PROMPT_FORM);

  const toggleEmotion = (value: CoreEmotion) => {
    setForm((prev) => {
      const hasValue = prev.coreEmotions.includes(value);
      if (hasValue) {
        const nextValues = prev.coreEmotions.filter((item) => item !== value);
        return { ...prev, coreEmotions: nextValues.length ? nextValues : ['ai_recommend'] };
      }
      if (value === 'ai_recommend') {
        return { ...prev, coreEmotions: ['ai_recommend'] };
      }
      const withoutAi = prev.coreEmotions.filter((item) => item !== 'ai_recommend');
      if (withoutAi.length >= 2) return prev;
      if (prev.coreEmotions.length >= 2) return prev;
      return { ...prev, coreEmotions: [...withoutAi, value] };
    });
  };

  const setMainGenre = (value: MainGenre) => {
    setForm((prev) => ({ ...prev, mainGenre: value }));
  };

  const toggleTexture = (value: TextureOption) => {
    setForm((prev) => {
      const hasValue = prev.textures.includes(value);
      if (hasValue) {
        const nextValues = prev.textures.filter((item) => item !== value);
        return { ...prev, textures: nextValues.length ? nextValues : ['ai_recommend'] };
      }
      if (value === 'ai_recommend') {
        return { ...prev, textures: ['ai_recommend'] };
      }
      const withoutAi = prev.textures.filter((item) => item !== 'ai_recommend');
      if (withoutAi.length >= 3) return prev;
      return { ...prev, textures: [...withoutAi, value] };
    });
  };

  const updateForm = <K extends keyof MusicPromptFormValues>(key: K, value: MusicPromptFormValues[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setOutputType = (value: MusicPromptFormValues['outputType']) => {
    setForm((prev) => ({
      ...prev,
      outputType: value,
      purpose: PURPOSE_BY_OUTPUT[value],
      durationTarget: DURATION_BY_OUTPUT[value],
      distributionIntent: 'social_and_release',
      versionType: VERSION_BY_OUTPUT[value],
      vocalMode: VOCAL_MODE_BY_OUTPUT[value],
    }));
  };

  const build = () => {
    const error = validateMusicPrompt(form);
    if (error) return { error, result: null as ReturnType<typeof generateMusicPrompt> | null };
    return { error: null, result: generateMusicPrompt(form) };
  };

  return {
    form,
    setForm,
    updateForm,
    setOutputType,
    toggleEmotion,
    setMainGenre,
    toggleTexture,
    build,
    reset: () => setForm(INITIAL_MUSIC_PROMPT_FORM),
  };
};
