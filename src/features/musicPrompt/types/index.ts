export type MusicPurpose =
  | 'youtube_focus'
  | 'cooking_bgm'
  | 'daily_listen'
  | 'emotional_playlist'
  | 'cafe_bgm'
  | 'shorts_bgm'
  | 'general_music';

export type InstrumentType =
  | 'piano'
  | 'acoustic_guitar'
  | 'electric_guitar'
  | 'lofi_keys'
  | 'strings'
  | 'synth_pad'
  | 'jazz_piano'
  | 'ai_recommend_single'
  | 'mixed';

export type VocalGender = 'female' | 'male' | 'mixed' | 'ai_recommend';
export type SongLanguageOption = 'Korean' | 'English' | 'Other' | '';
export type SongOutputType =
  | 'song'
  | 'hook_short'
  | 'instrumental';
export type SongDurationTarget =
  | 'd15'
  | 'd30'
  | 'd60'
  | 'd180'
  | 'd210'
  | 'auto';
export type SongDistributionIntent =
  | 'social_only'
  | 'release_only'
  | 'social_and_release';
export type SongVersionType =
  | 'original'
  | 'short_edit'
  | 'instrumental'
  | 'acoustic'
  | 'ambient';
export type SongVocalMode =
  | 'with_lyrics'
  | 'vocalize_only'
  | 'instrumental_only';
export type HookStrength = 'low' | 'medium' | 'high';
export type LoopMode = 'loopable' | 'natural_ending';
export type LyricDensity = 'minimal' | 'balanced' | 'dense';

export type CoreEmotion =
  | 'ai_recommend'
  | 'warm'
  | 'hopeful'
  | 'melancholic'
  | 'nostalgic'
  | 'dreamy'
  | 'tense'
  | 'dark'
  | 'romantic'
  | 'playful'
  | 'epic';

export type MainGenre =
  | 'ai_recommend'
  | 'pop'
  | 'ballad'
  | 'lofi'
  | 'acoustic_folk'
  | 'synthwave'
  | 'indie_electronic'
  | 'cinematic'
  | 'jazz_lounge'
  | 'ambient'
  | 'rnb';

export type TextureOption =
  | 'ai_recommend'
  | 'analog_warmth'
  | 'tape_saturation'
  | 'cinematic_ambience'
  | 'lush_reverb'
  | 'ambient_texture'
  | 'layered_harmonies'
  | 'stereo_widening'
  | 'low_pass_intro'
  | 'gated_snare'
  | 'detuned_synth'
  | 'vinyl_crackle'
  | 'rainy_ambience';

export type VocalStyleOption =
  | 'ai_recommend'
  | 'airy_female'
  | 'warm_male'
  | 'whisper_soft'
  | 'clean_mixed'
  | 'vocal_chops'
  | 'humming_only'
  | 'instrumental_focus'
  | 'no_vocals';

export type TempoRange = 'ai_recommend' | 'slow' | 'mid' | 'fast' | 'very_fast';
export type GenerationMode = 'safe' | 'balanced' | 'experimental';

export interface MusicPromptFormValues {
  purpose: MusicPurpose;
  outputType: SongOutputType;
  durationTarget: SongDurationTarget;
  distributionIntent: SongDistributionIntent;
  versionType: SongVersionType;
  vocalMode: SongVocalMode;
  coreEmotions: CoreEmotion[];
  mainGenre: MainGenre;
  textures: TextureOption[];
  vocalStyle: VocalStyleOption;
  tempoRange: TempoRange;
  worldbuilding: string;
  generationMode: GenerationMode;
  topic: string;
  instrument: InstrumentType;
  gender: VocalGender;
  languageOption: SongLanguageOption;
  language: string;
  lyricDensity: LyricDensity;
  keywords: string;
  extraNotes: string;
}

export interface MusicPromptDraft {
  outputType: SongOutputType;
  durationTarget: SongDurationTarget;
  distributionIntent: SongDistributionIntent;
  versionType: SongVersionType;
  vocalMode: SongVocalMode;
  topic: string;
  purpose: string;
  coreEmotion: string;
  supportEmotion?: string;
  mainGenre: string;
  supportGenre?: string;
  textures: string[];
  tempoLabel: string;
  bpmRange: string;
  rhythmStyle: string[];
  spaceStyle: string[];
  mixStyle: string[];
  instrumentStyle: string[];
  chordTendency: string[];
  arrangementNotes: string[];
  negativeConstraints: string[];
  safetyNotes: string[];
  distributionSafetyNotes: string[];
}

export interface MusicPromptInput {
  purpose: MusicPurpose;
  outputType: SongOutputType;
  durationTarget: SongDurationTarget;
  distributionIntent: SongDistributionIntent;
  versionType: SongVersionType;
  vocalMode: SongVocalMode;
  topic: string;
  coreEmotions: CoreEmotion[];
  mainGenre: MainGenre;
  textures: TextureOption[];
  vocalStyle: VocalStyleOption;
  tempoRange: TempoRange;
  worldbuilding: string;
  generationMode: GenerationMode;
  instrument: InstrumentType;
  vocalGender: VocalGender;
  language: string;
  lyricDensity: LyricDensity;
  keywords: string;
  extra: string;
}

export interface MusicPromptResult {
  draft: MusicPromptDraft;
  input: MusicPromptInput;
  stylePrompt: string;
  expandedProductionNotes: string;
  lyricsAndStructure: string;
  uniquenessStrategy: string[];
  draftPrompt: string;
  refinementPrompt: string;
  finalSunoPrompt: string;
  descriptionKo: string;
  youtubeTitles: string[];
  youtubeDescription: string;
  tagRequestPrompt: string;
  contentIdChecks: string[];
  distributionSafetyCheck: string[];
  preReleaseChecklist: string[];
  contentIdWarning: string;
  metadataNamingCaution: string[];
}
