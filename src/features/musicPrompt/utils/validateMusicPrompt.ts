import type { MusicPromptFormValues } from '@/features/musicPrompt/types';

export const validateMusicPrompt = (form: MusicPromptFormValues): string | null => {
  if (!form.topic.trim()) return '주제는 꼭 입력해 주세요.';
  if (form.coreEmotions.length === 0) return '핵심 감정을 1개 이상 선택해 주세요.';
  if (form.coreEmotions.length > 2) return '핵심 감정은 최대 2개까지 선택할 수 있어요.';
  if (form.textures.length > 3) return '사운드 질감은 최대 3개까지 선택할 수 있어요.';
  return null;
};
