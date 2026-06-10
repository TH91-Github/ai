import type {
  CoreEmotion,
  GenerationMode,
  MainGenre,
  MusicPurpose,
  SongDistributionIntent,
  SongDurationTarget,
  SongOutputType,
  SongVersionType,
  SongVocalMode,
  TempoRange,
  TextureOption,
  VocalGender,
  VocalStyleOption,
} from '@/features/musicPrompt/types';

export const OUTPUT_TYPE_OPTIONS: Array<{ value: SongOutputType; label: string; description: string }> = [
  { value: 'song', label: '일반 노래', description: '완성형 감상용 곡 · 약 3분' },
  { value: 'hook_short', label: '숏츠 훅', description: '짧고 강한 숏폼 음악 · 1분 이내' },
  { value: 'instrumental', label: '연주/BGM', description: '무보컬 배경 음악 · 약 3분' },
];

export const DURATION_OPTIONS: Array<{ value: SongDurationTarget; label: string }> = [
  { value: 'auto', label: 'AI 추천' },
  { value: 'd15', label: '15초' },
  { value: 'd30', label: '30초' },
  { value: 'd60', label: '1분' },
  { value: 'd180', label: '3분' },
  { value: 'd210', label: '3분 30초' },
];

export const DISTRIBUTION_OPTIONS: Array<{ value: SongDistributionIntent; label: string }> = [
  { value: 'social_only', label: 'SNS 업로드' },
  { value: 'release_only', label: '음원 등록' },
  { value: 'social_and_release', label: '둘 다 고려' },
];

export const PURPOSE_BY_OUTPUT: Record<SongOutputType, MusicPurpose> = {
  song: 'general_music',
  hook_short: 'shorts_bgm',
  instrumental: 'cafe_bgm',
};

export const VERSION_BY_OUTPUT: Record<SongOutputType, SongVersionType> = {
  song: 'original',
  hook_short: 'short_edit',
  instrumental: 'instrumental',
};

export const VOCAL_MODE_BY_OUTPUT: Record<SongOutputType, SongVocalMode> = {
  song: 'with_lyrics',
  hook_short: 'with_lyrics',
  instrumental: 'instrumental_only',
};

export const CORE_EMOTION_OPTIONS: Array<{ value: CoreEmotion; label: string }> = [
  { value: 'ai_recommend', label: 'AI 추천' },
  { value: 'warm', label: '따뜻함' },
  { value: 'hopeful', label: '희망' },
  { value: 'melancholic', label: '쓸쓸함' },
  { value: 'nostalgic', label: '향수' },
  { value: 'dreamy', label: '몽환' },
  { value: 'tense', label: '긴장감' },
  { value: 'dark', label: '어두움' },
  { value: 'romantic', label: '로맨틱' },
  { value: 'playful', label: '경쾌함' },
  { value: 'epic', label: '웅장함' },
];

export const MAIN_GENRE_OPTIONS: Array<{ value: MainGenre; label: string }> = [
  { value: 'ai_recommend', label: 'AI 추천' },
  { value: 'pop', label: '팝' },
  { value: 'ballad', label: '발라드' },
  { value: 'lofi', label: '로파이' },
  { value: 'acoustic_folk', label: '어쿠스틱 포크' },
  { value: 'synthwave', label: '신스웨이브' },
  { value: 'indie_electronic', label: '인디 일렉트로닉' },
  { value: 'cinematic', label: '시네마틱' },
  { value: 'jazz_lounge', label: '재즈 라운지' },
  { value: 'ambient', label: '앰비언트' },
  { value: 'rnb', label: '알앤비' },
];

export const TEXTURE_OPTIONS: Array<{ value: TextureOption; label: string }> = [
  { value: 'ai_recommend', label: 'AI 추천' },
  { value: 'analog_warmth', label: '아날로그 온기' },
  { value: 'tape_saturation', label: '테이프 새추레이션' },
  { value: 'cinematic_ambience', label: '시네마틱 앰비언스' },
  { value: 'lush_reverb', label: '풍성한 리버브' },
  { value: 'ambient_texture', label: '앰비언트 텍스처' },
  { value: 'layered_harmonies', label: '레이어드 하모니' },
  { value: 'stereo_widening', label: '스테레오 확장감' },
  { value: 'low_pass_intro', label: '로우패스 인트로' },
  { value: 'gated_snare', label: '게이티드 스네어' },
  { value: 'detuned_synth', label: '디튠 신스' },
  { value: 'vinyl_crackle', label: '바이닐 크랙클' },
  { value: 'rainy_ambience', label: '빗소리 앰비언스' },
];

export const VOCAL_STYLE_OPTIONS: Array<{ value: VocalStyleOption; label: string }> = [
  { value: 'ai_recommend', label: 'AI 추천' },
  { value: 'airy_female', label: '맑은 여성 보컬' },
  { value: 'warm_male', label: '따뜻한 남성 보컬' },
  { value: 'whisper_soft', label: '속삭이듯 부드럽게' },
  { value: 'clean_mixed', label: '깨끗한 혼성 보컬' },
  { value: 'vocal_chops', label: '보컬 찹' },
  { value: 'humming_only', label: '허밍 중심' },
  { value: 'instrumental_focus', label: '보컬 최소화' },
  { value: 'no_vocals', label: '보컬 없음' },
];

export const TEMPO_OPTIONS: Array<{ value: TempoRange; label: string; bpm: string }> = [
  { value: 'ai_recommend', label: 'AI 추천', bpm: '주제에 맞게 선택' },
  { value: 'slow', label: '느림', bpm: '60-80 BPM' },
  { value: 'mid', label: '중간', bpm: '80-110 BPM' },
  { value: 'fast', label: '빠름', bpm: '110-140 BPM' },
  { value: 'very_fast', label: '매우 빠름', bpm: '140+ BPM' },
];

export const MODE_OPTIONS: Array<{ value: GenerationMode; label: string; description: string }> = [
  { value: 'safe', label: 'Safe', description: '대중성과 유통 안정성 우선' },
  { value: 'balanced', label: 'Balanced', description: '기본 추천 모드' },
  { value: 'experimental', label: 'Experimental', description: '질감 실험 허용' },
];

export const VOCAL_GENDER_OPTIONS: Array<{ value: VocalGender; label: string }> = [
  { value: 'female', label: '여성' },
  { value: 'male', label: '남성' },
  { value: 'mixed', label: '혼성' },
  { value: 'ai_recommend', label: 'AI 추천' },
];

export const EMOTION_EXPANSIONS: Record<CoreEmotion, string[]> = {
  ai_recommend: ['balanced emotional center'],
  warm: ['soft dynamic rise', 'gentle harmonic glow'],
  hopeful: ['uplifting rhythm lift', 'bright harmonic movement'],
  melancholic: ['restrained melodic descent', 'soft unresolved tension'],
  nostalgic: ['faded tape mood', 'memory-like harmonic color'],
  dreamy: ['floating pad movement', 'blurred ambience'],
  tense: ['tight pulse', 'controlled buildup'],
  dark: ['shadowed low-end', 'dimmer harmonic color'],
  romantic: ['intimate phrasing', 'lush harmonic spread'],
  playful: ['light syncopation', 'quick rhythmic bounce'],
  epic: ['wide cinematic lift', 'layered dramatic swell'],
};

export const GENRE_EXPANSIONS: Record<MainGenre, string[]> = {
  ai_recommend: ['clear stylistic center', 'focused arrangement'],
  pop: ['clear topline focus', 'tight groove'],
  ballad: ['emotional arc', 'chorus-led lift'],
  lofi: ['dusty texture', 'laid-back groove'],
  acoustic_folk: ['organic string feel', 'intimate room tone'],
  synthwave: ['retro synth pulse', 'gated drum accent'],
  indie_electronic: ['hybrid rhythmic layers', 'off-center texture'],
  cinematic: ['wide spatial build', 'dramatic motion'],
  jazz_lounge: ['soft harmonic color', 'brushed rhythmic elegance'],
  ambient: ['slow-moving texture', 'minimal foreground'],
  rnb: ['smooth pocket groove', 'rounded low-end'],
};

export const TEXTURE_EXPANSIONS: Record<TextureOption, string[]> = {
  ai_recommend: ['balanced production texture'],
  analog_warmth: ['analog warmth'],
  tape_saturation: ['tape saturation'],
  cinematic_ambience: ['cinematic ambience'],
  lush_reverb: ['lush reverb'],
  ambient_texture: ['ambient texture'],
  layered_harmonies: ['layered harmonies'],
  stereo_widening: ['stereo widening'],
  low_pass_intro: ['low-pass filtered intro'],
  gated_snare: ['gated snare'],
  detuned_synth: ['detuned analog synth'],
  vinyl_crackle: ['vinyl crackle'],
  rainy_ambience: ['rainy ambience'],
};

export const VOCAL_STYLE_EXPANSIONS: Record<VocalStyleOption, string[]> = {
  ai_recommend: ['balanced vocal direction'],
  airy_female: ['airy female vocal', 'clean top-end phrasing'],
  warm_male: ['warm male vocal', 'grounded tone'],
  whisper_soft: ['whisper-soft delivery', 'close-mic intimacy'],
  clean_mixed: ['clean mixed vocal blend', 'balanced harmony'],
  vocal_chops: ['vocal chops', 'minimal lyric fragments'],
  humming_only: ['humming only', 'wordless melodic line'],
  instrumental_focus: ['vocal-light arrangement', 'instrument first balance'],
  no_vocals: ['no vocals'],
};

export const TEMPO_EXPANSIONS: Record<TempoRange, { bpm: string; rhythm: string[] }> = {
  ai_recommend: { bpm: '80-110 BPM', rhythm: ['balanced drive', 'steady rhythm hook'] },
  slow: { bpm: '60-80 BPM', rhythm: ['wide groove spacing', 'subtle pulse'] },
  mid: { bpm: '80-110 BPM', rhythm: ['balanced drive', 'steady rhythm hook'] },
  fast: { bpm: '110-140 BPM', rhythm: ['forward motion', 'tight syncopation'] },
  very_fast: { bpm: '140+ BPM', rhythm: ['urgent pulse', 'compact phrasing'] },
};
