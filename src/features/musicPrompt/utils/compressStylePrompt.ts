import type { MusicPromptDraft } from '@/features/musicPrompt/types';

const uniq = (items: Array<string | undefined>) =>
  [...new Set(items.filter((item): item is string => Boolean(item)))];

export const compressStylePrompt = (draft: MusicPromptDraft): string => {
  const parts = uniq([
    draft.mainGenre,
    draft.supportGenre,
    draft.bpmRange,
    draft.tempoLabel,
    draft.instrumentStyle[0],
    draft.textures[0],
    draft.textures[1],
    draft.rhythmStyle[0],
    draft.spaceStyle[0],
  ]);

  const prompt = parts.join(', ').replace(/\s+/g, ' ').trim();
  if (prompt.length <= 140) return prompt;

  return uniq([
    draft.mainGenre,
    draft.bpmRange,
    draft.instrumentStyle[0],
    draft.textures[0],
    draft.rhythmStyle[0],
    draft.spaceStyle[0],
  ]).join(', ');
};
