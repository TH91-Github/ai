// =============================================================
// src/components/draft/SongDraftForm.tsx
// 역할: 노래 제목 - 가수명 입력 기반 ChatGPT 요청 프롬프트 생성
// =============================================================

import React, { useEffect, useState } from 'react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import styles from './DraftForm.module.scss';

interface Props {
  onError: (msg: string) => void;
}

const buildSongPrompt = (songTitle: string, artistName: string) => `${songTitle} - ${artistName} 감성으로 새 곡을 만들어줘.

중요 기준:
* 곡 스타일은 반드시 사용자가 입력한 노래 자체를 중심으로 잡아줘.
* 가수는 장르를 바꾸는 기준이 아니라 보컬 질감과 목소리 스타일 참고로만 사용해줘.
* 예를 들어 노래가 잔잔하면, 가수가 거친 락발라드 계열이어도 곡을 락발라드로 바꾸지 말고, 잔잔한 곡 위에 거칠고 깊은 보컬 질감만 반영해줘.
* 원곡 제목, 핵심 표현, 대표 가사, 상징적인 배경은 그대로 쓰지 말고 완전히 새롭게 만들어줘.
* 원곡과 너무 비슷한 제목, 상황, 장소, 물건 이미지는 피하고 감정만 가져와줘.
* 예: 안동역 감성이어도 역, 승강장, 기차를 그대로 쓰지 말고 다른 배경으로 바꿔줘.
* 표절 느낌이 나지 않게 주제와 장면은 새로 구성해줘.

내가 원하는 결과:
1. 새 제목
2. Suno 스타일 프롬프트
3. 가사 전체

가사 기준:
* 복사하기 쉽게 제목은 가사 블록 안에 넣지 말아줘.
* 입력한 노래의 스타일과 가사 밀도를 파악해서 약 3분대 완성곡에 어울리는 분량으로 작성해줘.
* 트로트/트로트 발라드는 약 36~44줄 사이로 작성해줘.
* 모든 장르는 원곡 감성과 장르 특성에 맞춰 너무 짧거나 길지 않은 약 3분대 곡으로 자연스럽게 맞춰줘.
* 후렴 반복을 과하게 넣지 말아줘.
* bpm, 곡 길이, 가사 밀도, 장르 특성에 맞춰 가사가 짧아도 되니 3분대로.
* 전주는 15초 내외로 짧게. 
* 1,000자 이상으로 길게 작성하지 말고, 3분대 완성곡에 맞는 적절한 분량으로 작성해줘.
* 남자 가수 곡이지만 여자 가수 목소리로 해도 돼 ai 판별, 가수 목소리 유사성을 피하기 위함.
* 구조는 보통 verse chorus verse chorus short bridge final chorus 정도로 구성해줘.
* 단, 섹션 표기는 넣지 말고 순수 가사만 작성해줘.

Suno 스타일 프롬프트에 반드시 반영할 공통 금지/선호 조건:
* Suno 스타일 프롬프트는 1,000자가 넘지 않게 핵심 스타일, 보컬 질감, 편곡 방향만 압축해서 요약해줘.
* medium length complete song
* about 3 minutes, medium length complete song
* concise arrangement
* short intro
* vocals start early
* avoid long instrumental intro
* avoid extended solo break
* avoid long outro
* balanced verse chorus verse chorus bridge final chorus structure
* no excessive repetition
* no autotune
* no vocoder
* no robotic AI voice
* no same generic vocal tone
* unique vocal character
* dry close vocal
* no heavy echo
* no excessive reverb
* no choir
* no crowd
* no live audience sound
* no shouting
* no belting
* no strained high notes
* no piercing high notes
* no humming intro
* no ooh/yeah intro

주의:
* target duration 3:15 to 3:40, must end before 4 minutes, finish cleanly 같은 너무 강한 시간 제한 문구는 넣지 마.
* 이런 문구는 Suno에서 2초짜리 비정상 생성이 될 수 있으니 피해야 해.
* 대신 자연스럽게 medium length complete song, about 3 minutes, concise arrangement처럼 유도해줘.

보컬 기준:
* 매번 같은 보컬 문장을 반복하지 말고 곡마다 다르게 작성해줘.
* 같은 중저음/허스키라도 곡에 맞게 다르게 표현해줘.
* 예:
  * 정통 트로트: 구수하고 깊은 중년 보컬, 자연스러운 꺾임
  * 세련된 트로트 발라드: 부드럽고 품격 있는 남성 보컬
  * 여성 트로트 발라드: 맑지만 한이 있는 여성 보컬
  * 신나는 트로트: 밝고 힘 있는 보컬, 선명한 딕션
  * 감성 힙합: 낮고 담백한 랩 톤, 말하듯 흐르는 플로우
  * 강한 힙합: 날카로운 딕션, 단단한 랩 톤, 소리 지르지 않는 에너지
* 가수는 보컬 질감 참고만 하고, 곡의 장르/편곡은 입력한 노래의 감성을 중심으로 판단해줘.

싫어하는 스타일:
* 긴 전주
* 30초 이상 전주
* 긴 간주
* 긴 아웃트로
* 오토튠
* 보코더
* 과한 에코
* 과한 리버브
* 매번 같은 AI 목소리
* 로봇 같은 보컬
* 합창
* 군중 소리
* 라이브 관객 소리
* 허밍 인트로
* 우~ yeah~ 같은 인트로
* 막 지르는 고음
* 찢어지는 고음
* 과한 벨팅
* 샤우팅
* 노래 스타일과 가사 흐름을 파악하지 못해 불필요하게 길어지는 구성
* 1분대처럼 너무 짧게 끝나는 구성

출력 형식:
1. 새 제목
2. Suno 스타일 프롬프트
3. 가사 전체

생성된 결과는 바로 복사해서 사용할 수 있게 작성해줘.`;

const parseSongInput = (value: string) => {
  const parts = value.split('-');
  if (parts.length < 2) return null;

  const songTitle = parts[0].trim();
  const artistName = parts.slice(1).join('-').trim();

  if (!songTitle || !artistName) return null;
  return { songTitle, artistName };
};

const SongDraftForm: React.FC<Props> = ({ onError }) => {
  const [inputValue, setInputValue] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleGenerate = () => {
    const parsed = parseSongInput(inputValue);
    if (!parsed) {
      onError('제목 - 가수 형식으로 입력해주세요.');
      return;
    }

    setGeneratedPrompt(buildSongPrompt(parsed.songTitle, parsed.artistName));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!generatedPrompt.trim()) {
      onError('먼저 프롬프트를 생성해 주세요.');
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
    } catch {
      onError('클립보드 복사에 실패했습니다. 직접 선택하여 복사해 주세요.');
    }
  };

  return (
    <div className={styles.formBody}>
      <Input
        label="노래 제목 - 가수명"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder="예: 남자라는 이유로 - 조항조"
        fullWidth
      />

      <div className={styles.actionRow}>
        <Button type="button" onClick={handleGenerate}>
          프롬프트 생성
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleCopy}
          disabled={!generatedPrompt}
        >
          복사하기
        </Button>
        {copied && <span className={styles.copyStatus}>복사 완료</span>}
      </div>

      <textarea
        className={styles.resultTextarea}
        value={generatedPrompt}
        onChange={(event) => setGeneratedPrompt(event.target.value)}
        placeholder="생성된 ChatGPT 요청 프롬프트가 여기에 표시됩니다."
        rows={22}
      />
    </div>
  );
};

export default SongDraftForm;
