import {
  DISTRIBUTION_OPTIONS,
  EMOTION_EXPANSIONS,
  GENRE_EXPANSIONS,
  MODE_OPTIONS,
  PURPOSE_BY_OUTPUT,
  TEMPO_EXPANSIONS,
  TEXTURE_EXPANSIONS,
  VOCAL_MODE_BY_OUTPUT,
  VOCAL_STYLE_EXPANSIONS,
  VERSION_BY_OUTPUT,
} from '@/features/musicPrompt/constants/options';
import type { GeneratedPrompt } from '@/types';
import type {
  CoreEmotion,
  MainGenre,
  MusicPromptDraft,
  MusicPromptFormValues,
  MusicPromptInput,
  MusicPromptResult,
  SongDistributionIntent,
  TempoRange,
  TextureOption,
  VocalStyleOption,
} from '@/features/musicPrompt/types';
import { compressStylePrompt } from '@/features/musicPrompt/utils/compressStylePrompt';

const SUPPORT_GENRE_MAP: Partial<Record<MainGenre, MainGenre>> = {
  pop: 'rnb',
  ballad: 'cinematic',
  lofi: 'ambient',
  acoustic_folk: 'ballad',
  synthwave: 'indie_electronic',
  indie_electronic: 'ambient',
  cinematic: 'ambient',
  jazz_lounge: 'rnb',
  ambient: 'cinematic',
  rnb: 'pop',
};

const MODE_SAFETY_NOTES: Record<MusicPromptFormValues['generationMode'], string[]> = {
  safe: [
    'keep arrangement accessible and distribution-friendly',
    'limit extreme sound design',
    'favor stable phrasing and clean tonal center',
  ],
  balanced: [
    'balance accessibility with tasteful texture variation',
    'allow one standout rhythmic or textural hook',
  ],
  experimental: [
    'allow bold texture contrasts',
    'allow asymmetrical phrasing in small doses',
    'keep the main genre center intact',
  ],
};

const DISTRIBUTION_WARNING_MAP: Record<SongDistributionIntent, string[]> = {
  social_only: [
    'Short-form retention matters, so the opening seconds should resolve quickly.',
  ],
  release_only: [
    'Favor full-track cohesion and natural ending over loop-first design.',
  ],
  social_and_release: [
    'Separate short edit and release master are recommended.',
    'Avoid repeatedly uploading the same master to prevent self Content ID overlap.',
  ],
};

const INSTRUMENT_STYLE_MAP = {
  piano: ['soft felt piano', 'clean natural resonance'],
  acoustic_guitar: ['fingerpicked acoustic guitar', 'subtle pick texture'],
  electric_guitar: ['clean electric guitar', 'ambient reverb tail'],
  lofi_keys: ['lofi keys', 'dusty chord texture'],
  strings: ['soft cinematic strings', 'gentle swell'],
  synth_pad: ['detuned analog synth', 'wide pad wash'],
  jazz_piano: ['jazz lounge piano', 'smooth voicing'],
  ai_recommend_single: ['single best-fit lead instrument', 'one-instrument focus'],
  mixed: ['hybrid instrument blend', 'layered arrangement'],
} as const;

const formatBulletBlock = (title: string, items: string[]) =>
  `## ${title}\n\n- ${items.join('\n- ')}`;

const hasKeyword = (text: string, keywords: string[]) =>
  keywords.some((keyword) => text.includes(keyword));

const resolveCoreEmotions = (form: MusicPromptFormValues): CoreEmotion[] => {
  const selected = form.coreEmotions.filter((item) => item !== 'ai_recommend');
  if (selected.length) return selected;

  const context = `${form.topic} ${form.worldbuilding} ${form.keywords} ${form.extraNotes}`.toLowerCase();
  if (hasKeyword(context, ['비', 'rain', '새벽', 'midnight', '밤', 'night'])) return ['nostalgic'];
  if (hasKeyword(context, ['카페', 'cafe', '휴식', 'relax', '잔잔'])) return ['warm'];
  if (form.outputType === 'hook_short') return ['playful'];
  if (form.outputType === 'instrumental') return ['warm'];
  return ['hopeful'];
};

const resolveMainGenre = (form: MusicPromptFormValues): MainGenre => {
  if (form.mainGenre !== 'ai_recommend') return form.mainGenre;

  const context = `${form.topic} ${form.worldbuilding} ${form.keywords} ${form.extraNotes}`.toLowerCase();
  if (hasKeyword(context, ['통기타', 'guitar', 'acoustic', '포크', 'folk'])) return 'acoustic_folk';
  if (hasKeyword(context, ['피아노', 'piano', '발라드', 'ballad'])) return 'ballad';
  if (hasKeyword(context, ['카페', 'cafe', 'lofi', '브이로그', 'vlog'])) return 'lofi';
  if (hasKeyword(context, ['신스', 'synth', '네온', 'city', 'night drive'])) return 'synthwave';
  if (form.outputType === 'hook_short') return 'pop';
  if (form.outputType === 'instrumental') return 'lofi';
  return 'pop';
};

const resolveTextures = (form: MusicPromptFormValues): TextureOption[] => {
  const selected = form.textures.filter((item) => item !== 'ai_recommend');
  if (selected.length) return selected;

  const context = `${form.topic} ${form.worldbuilding} ${form.keywords} ${form.extraNotes}`.toLowerCase();
  if (hasKeyword(context, ['비', 'rain'])) return ['rainy_ambience', 'lush_reverb'];
  if (hasKeyword(context, ['빈티지', 'lofi', '카세트', 'tape'])) return ['tape_saturation', 'vinyl_crackle'];
  if (form.outputType === 'hook_short') return ['gated_snare', 'stereo_widening'];
  if (form.outputType === 'instrumental') return ['analog_warmth', 'ambient_texture'];
  return ['analog_warmth', 'lush_reverb'];
};

const resolveVocalStyle = (form: MusicPromptFormValues): VocalStyleOption => {
  if (form.vocalMode === 'instrumental_only') return 'no_vocals';
  if (form.vocalStyle !== 'ai_recommend') return form.vocalStyle;
  if (form.outputType === 'hook_short') return 'vocal_chops';
  if (form.gender === 'female') return 'airy_female';
  if (form.gender === 'male') return 'warm_male';
  if (form.gender === 'mixed') return 'clean_mixed';
  return 'clean_mixed';
};

const resolveTempoRange = (form: MusicPromptFormValues): TempoRange => {
  if (form.tempoRange !== 'ai_recommend') return form.tempoRange;

  const context = `${form.topic} ${form.worldbuilding} ${form.keywords} ${form.extraNotes}`.toLowerCase();
  if (hasKeyword(context, ['잔잔', 'calm', 'slow', '새벽', 'rain'])) return 'slow';
  if (hasKeyword(context, ['중독', 'hook', 'shorts', '릴스', 'reels', '틱톡', 'tiktok'])) return 'fast';
  if (form.outputType === 'hook_short') return 'fast';
  return 'mid';
};

const buildLyricsAndStructure = (draft: MusicPromptDraft, input: MusicPromptInput) => {
  if (input.vocalMode === 'instrumental_only') {
    return '[Intro]\nroom tone and lead instrument motif\n\n[Build-up]\nrhythm hook expands\n\n[Outro]\nnatural ending or loop tail';
  }
  if (input.outputType === 'hook_short') {
    return '[Hook]\nshort memorable phrase\n[Drop]\nrhythm hook repeats\n[Pause]\nbrief breath before loop';
  }
  return '[Verse]\nmain emotional setup\n\n[Chorus]\nmemorable lift\n\n[Bridge]\ncontrast or tension change\n\n[Outro]\nnatural resolution';
};

const buildDescriptionKo = (draft: MusicPromptDraft, input: MusicPromptInput) => {
  const distributionLabel =
    DISTRIBUTION_OPTIONS.find((option) => option.value === input.distributionIntent)?.label ??
    input.distributionIntent;
  const modeLabel =
    MODE_OPTIONS.find((option) => option.value === input.generationMode)?.label ??
    input.generationMode;

  return [
    `${input.topic}을 중심으로 ${draft.mainGenre} 기반의 ${draft.coreEmotion} 무드를 잡았습니다.`,
    draft.supportEmotion ? `${draft.supportEmotion} 감정을 보조축으로 묶었습니다.` : '',
    `${draft.bpmRange} 범위와 ${draft.tempoLabel} 에너지로 정리했고, ${distributionLabel} 기준을 함께 고려했습니다.`,
    `${modeLabel} 모드라서 ${input.generationMode === 'safe' ? '안정성과 유통 친화성' : input.generationMode === 'balanced' ? '대중성과 질감의 균형' : '실험적 질감'}을 우선했습니다.`,
  ]
    .filter(Boolean)
    .join(' ');
};

export const generateMusicPrompt = (form: MusicPromptFormValues): GeneratedPrompt => {
  const resolvedCoreEmotions = resolveCoreEmotions(form);
  const resolvedMainGenre = resolveMainGenre(form);
  const resolvedTextures = resolveTextures(form);
  const resolvedVocalStyle = resolveVocalStyle(form);
  const resolvedTempoRange = resolveTempoRange(form);

  const input: MusicPromptInput = {
    purpose: PURPOSE_BY_OUTPUT[form.outputType],
    outputType: form.outputType,
    durationTarget: form.durationTarget,
    distributionIntent: form.distributionIntent,
    versionType: form.versionType || VERSION_BY_OUTPUT[form.outputType],
    vocalMode: form.vocalMode || VOCAL_MODE_BY_OUTPUT[form.outputType],
    topic: form.topic.trim(),
    coreEmotions: resolvedCoreEmotions,
    mainGenre: resolvedMainGenre,
    textures: resolvedTextures,
    vocalStyle: resolvedVocalStyle,
    tempoRange: resolvedTempoRange,
    worldbuilding: form.worldbuilding.trim(),
    generationMode: form.generationMode,
    instrument: form.instrument,
    vocalGender: form.gender,
    language:
      form.languageOption === 'Other'
        ? form.language.trim()
        : form.languageOption || 'Korean',
    lyricDensity: form.lyricDensity,
    keywords: form.keywords.trim(),
    extra: form.extraNotes.trim(),
  };

  const tempoExpansion = TEMPO_EXPANSIONS[input.tempoRange];
  const primaryEmotion = input.coreEmotions[0];
  const supportEmotion = input.coreEmotions[1];
  const mainGenre = input.mainGenre;
  const supportGenre =
    input.generationMode === 'safe' ? undefined : SUPPORT_GENRE_MAP[mainGenre];
  const textureTokens = input.textures.flatMap((item) => TEXTURE_EXPANSIONS[item]);
  const vocalTokens = VOCAL_STYLE_EXPANSIONS[input.vocalStyle];
  const emotionTokens = input.coreEmotions.flatMap((item) => EMOTION_EXPANSIONS[item]);
  const genreTokens = GENRE_EXPANSIONS[mainGenre];

  const draft: MusicPromptDraft = {
    outputType: input.outputType,
    durationTarget: input.durationTarget,
    distributionIntent: input.distributionIntent,
    versionType: input.versionType,
    vocalMode: input.vocalMode,
    topic: input.topic,
    purpose: input.purpose,
    coreEmotion: primaryEmotion,
    supportEmotion,
    mainGenre,
    supportGenre,
    textures: textureTokens.slice(0, 4),
    tempoLabel: input.tempoRange,
    bpmRange: tempoExpansion.bpm,
    rhythmStyle: [...tempoExpansion.rhythm, 'rhythm hook first', 'light syncopation'],
    spaceStyle: input.worldbuilding
      ? ['cinematic ambience', 'stereo widening', input.worldbuilding]
      : ['cinematic ambience', 'stereo widening'],
    mixStyle: ['tape saturation', 'controlled reverb tail', 'balanced stereo width'],
    instrumentStyle: INSTRUMENT_STYLE_MAP[input.instrument].slice(0, 2),
    chordTendency: ['avoid predictable I-V-vi-IV', 'prefer off-center harmonic movement'],
    arrangementNotes: [
      ...genreTokens.slice(0, 2),
      ...emotionTokens.slice(0, 2),
      ...vocalTokens.slice(0, 2),
      input.outputType === 'hook_short' ? 'instant first-second hook' : 'measured emotional arc',
      'memorable rhythm motif',
      input.extra || '',
    ].filter(Boolean),
    negativeConstraints: [
      'avoid artist imitation',
      'avoid famous OST resemblance',
      'avoid ad-music familiarity',
      'avoid overused four-bar repetition',
      input.outputType === 'hook_short' ? 'no slow intro' : '',
    ].filter(Boolean),
    safetyNotes: [
      'unique original melody',
      'original chord progression',
      'non-generic hook',
      'avoid similarity to existing songs',
      'avoid artist imitation',
      'avoid copyrighted melody',
      'content-id safe direction',
      'suitable for original music distribution',
      ...MODE_SAFETY_NOTES[input.generationMode],
    ],
    distributionSafetyNotes: [
      '업로드 전 직접 청취 검수 필요',
      '플랫폼 정책 직접 확인 필요',
      '반복 생성본 간 유사성 점검 필요',
      ...DISTRIBUTION_WARNING_MAP[input.distributionIntent],
    ],
  };

  const stylePrompt = compressStylePrompt(draft);
  const expandedProductionNotes = [
    `Genre Core: ${draft.mainGenre}${draft.supportGenre ? ` + ${draft.supportGenre}` : ''}`,
    `Rhythm: ${draft.rhythmStyle.join(', ')}`,
    `Texture: ${draft.textures.join(', ')}`,
    `Space: ${draft.spaceStyle.join(', ')}`,
    `Mix: ${draft.mixStyle.join(', ')}`,
    `Instrument: ${draft.instrumentStyle.join(', ')}`,
  ].join('\n');
  const uniquenessStrategy = [
    '메인 장르 1개와 보조 장르 최대 1개만 유지했습니다.',
    '멜로디보다 rhythm hook과 syncopation 중심으로 설계했습니다.',
    '흔한 코드 진행 의존을 줄이고 비대칭적 전개를 유도했습니다.',
    '유명 OST, 광고 음악, 특정 아티스트 연상을 피하는 제약을 추가했습니다.',
  ];
  const draftPrompt = JSON.stringify(draft, null, 2);
  const refinementPrompt = [
    'Refine this into a Suno-friendly style prompt.',
    `Keep ${draft.mainGenre} as the main genre${draft.supportGenre ? ` with subtle ${draft.supportGenre}` : ''}.`,
    'Do not imitate any artist, song, OST, or commercial ad music.',
    'Keep the final style prompt short, strong, and token-based.',
  ].join(' ');
  const finalSunoPrompt = stylePrompt;
  const descriptionKo = buildDescriptionKo(draft, input);
  const youtubeTitles = [
    `${input.topic} ${input.outputType === 'hook_short' ? '숏츠용 스타일 프롬프트' : 'AI 음악 프롬프트'}`,
    `${input.topic} | ${draft.mainGenre} ${draft.bpmRange}`,
    `${input.topic} Suno 스타일 프롬프트`,
  ];
  const youtubeDescription = [
    `${input.topic} 주제로 설계한 AI 음악 프롬프트입니다.`,
    `메인 장르: ${draft.mainGenre}`,
    `템포 범위: ${draft.bpmRange}`,
    `출력 유형: ${input.outputType}`,
    `배포 의도: ${input.distributionIntent}`,
  ].join('\n');
  const tagRequestPrompt =
    '메인 장르, 핵심 감정, 텍스처, 템포를 바탕으로 유튜브용 태그 8~12개를 추천해 주세요. 실존 아티스트명과 곡명은 제외합니다.';
  const contentIdChecks = [
    '특정 곡과 멜로디 유사성이 없는지 직접 청취 확인',
    '특정 아티스트 스타일로 바로 들리지 않는지 확인',
    '반복 생성본끼리의 유사성 비교',
  ];
  const distributionSafetyCheck = [
    ...draft.distributionSafetyNotes,
    '100% 안전성 보장은 불가하며 직접 검수 전제로 사용해야 합니다.',
  ];
  const preReleaseChecklist = [
    '실존 아티스트명 사용 여부 확인',
    '유명 곡명 또는 OST명 사용 여부 확인',
    '멜로디 유사성 여부 확인',
    '반복 생성본 유사성 여부 확인',
    'Content ID 확인 여부 점검',
    '플랫폼 정책 확인 여부 점검',
    '상업 사용 가능 여부 점검',
  ];
  const contentIdWarning =
    '이 결과는 유사성을 낮추기 위한 보조 도구이며, Content ID 충돌이 완전히 없어지는 것은 아닙니다.';
  const metadataNamingCaution = [
    '실존 아티스트명 직접 사용 금지',
    '실존 곡명, OST명, 광고 음악명 직접 사용 금지',
    'in the style of 같은 표현 금지',
  ];

  const songData: MusicPromptResult = {
    draft,
    input,
    stylePrompt,
    expandedProductionNotes,
    lyricsAndStructure: buildLyricsAndStructure(draft, input),
    uniquenessStrategy,
    draftPrompt,
    refinementPrompt,
    finalSunoPrompt,
    descriptionKo,
    youtubeTitles,
    youtubeDescription,
    tagRequestPrompt,
    contentIdChecks,
    distributionSafetyCheck,
    preReleaseChecklist,
    contentIdWarning,
    metadataNamingCaution,
  };

  const prompt = [
    '## Style Prompt',
    stylePrompt,
    '',
    '## Expanded Production Notes',
    expandedProductionNotes,
    '',
    '## Lyrics & Structure',
    songData.lyricsAndStructure,
    '',
    formatBulletBlock('Uniqueness Strategy', uniquenessStrategy),
    '',
    '## Internal Draft',
    draftPrompt,
    '',
    '## Refinement Prompt',
    refinementPrompt,
  ].join('\n');

  return {
    title: `음악 프롬프트: ${input.topic}`,
    prompt,
    subTopic: input.topic,
    keywords: [input.topic, draft.mainGenre, ...input.coreEmotions].filter(Boolean),
    includeHtml: false,
    songData,
  };
};
