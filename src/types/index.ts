// =============================================================
// src/types/index.ts
// 역할: 프로젝트 전반에서 사용되는 핵심 타입 정의
// 주의: 이 파일은 런타임 값을 포함하지 않음 (순수 타입만)
// =============================================================

// ── 블로그 카테고리 타입 ──────────────────────────────────────
export type BlogType = 'general' | 'history' | 'song' | 'video';
export type ToneType = 'blog' | 'info';
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
  | 'mixed';
export type LyricsMode = 'with_lyrics' | 'no_lyrics';
export type VocalGender = 'female' | 'male' | 'mixed' | 'ai_recommend';

// ── 일반 주제형 입력 폼 ───────────────────────────────────────
export interface GeneralDraftForm {
  mainTopic: string;
  subTopic: string;       // 자동 선택 or 직접 입력
  tone: ToneType;
  includeHtml: boolean;   // HTML 결과 유도 여부
  includeImage: boolean;  // 이미지 프롬프트 포함 여부
}

// ── 오늘의 역사형 입력 폼 ─────────────────────────────────────
export interface HistoryDraftForm {
  date: string;           // YYYY-MM-DD
  koreaFirst: boolean;    // 국내 우선 여부
  tone: ToneType;
  includeImage: boolean;
}

// ── 노래 프롬프트 입력 폼 ─────────────────────────────────────
export interface SongDraftForm {
  purpose: MusicPurpose;
  topic: string;
  mood: string;
  genre: string;
  tempo: string;
  instrument: InstrumentType;
  includeLyrics: boolean;
  gender: VocalGender;
  voiceStyle: string;
  language: string;
  lyricStyle: string;
  keywords: string;
  extraNotes: string;
}

export interface SongPromptInput {
  purpose: MusicPurpose;
  topic: string;
  mood: string;
  genre: string;
  tempo: string;
  instrument: InstrumentType;
  lyricsMode: LyricsMode;
  vocalGender: VocalGender;
  vocalStyle: string;
  lyricStyle: string;
  language: string;
  keywords: string;
  extra: string;
}

export interface SavedSongPrompt {
  id: string;
  type: 'song';
  createdAt: number;
  input: SongPromptInput;
  sunoPrompt: string;
  youtubeTitles: string[];
  youtubeDescription: string;
  youtubeTags: string;
}

export interface SongGeneratedData {
  input: SongPromptInput;
  sunoPrompt: string;
  koreanPrompt: string;
  youtubeTitles: string[];
  youtubeDescription: string;
  youtubeTags: string;
  contentIdNotes: string[];
}

// ── 영상 프롬프트 입력 폼 ─────────────────────────────────────
export interface VideoDraftForm {
  topic: string;
  platform: string;
  style: string;
  duration: string;
  tone: string;
  audience: string;
  format: string;
  keywords: string;
}

// ── 등록 목록 항목 ────────────────────────────────────────────
export interface RegistryItem {
  id: string;
  category: 'blog';
  type: BlogType;
  mainTopic: string;
  subTopic: string;
  title: string;
  url: string;
  keywords: string[];
  createdAt: string;      // ISO 8601
  songData?: SavedSongPrompt;
}

// ── 중복 체크 결과 ────────────────────────────────────────────
export interface DuplicateCheckResult {
  isDuplicate: boolean;
  reason?: string;
  matchedItem?: RegistryItem;
}

// ── 생성된 프롬프트 ───────────────────────────────────────────
export interface GeneratedPrompt {
  title: string;
  prompt: string;
  subTopic: string;
  keywords: string[];
  includeHtml: boolean; // HTML 파일 다운로드 버튼 표시 여부
  songData?: SongGeneratedData;
}

// ── 통계 ─────────────────────────────────────────────────────
export interface StatsData {
  totalCount: number;
  byTopic: Record<string, number>;
  byType: Record<BlogType, number>;
  recentItems: RegistryItem[];
  keywordFrequency: Array<{ keyword: string; count: number }>;
}

// ── Topic Pool ────────────────────────────────────────────────
export interface TopicPool {
  [mainTopic: string]: string[];
}
