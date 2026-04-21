// =============================================================
// src/components/draft/HistoryDraftForm.tsx
// 역할: 오늘의 역사형 프롬프트 생성 입력 폼
// 주요 기능:
//   - 날짜 선택 (기본: 오늘)
//   - 국내 우선, 톤, 이미지 포함 여부 설정
//   - 프롬프트 생성
// =============================================================

import React, { useState } from 'react';
import Input from '@/components/common/Input';
import Toggle from '@/components/common/Toggle';
import Button from '@/components/common/Button';
import type { HistoryDraftForm as FormType, GeneratedPrompt } from '@/types';
import { generateHistoryPrompt, getMaxNextMonthString, getTodayString } from '@/utils/promptGenerator';
import { useRegistryStore } from '@/store/useRegistryStore';
import styles from './DraftForm.module.scss';

interface Props {
  onGenerated: (result: GeneratedPrompt) => void;
  onError: (msg: string) => void;
}

const HistoryDraftForm: React.FC<Props> = ({ onGenerated, onError }) => {
  const { items } = useRegistryStore();
  const [form, setForm] = useState<FormType>({
    date: getTodayString(),
    koreaFirst: true,
    tone: 'blog',
    includeImage: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ date?: string }>({});

  const validate = (): boolean => {
    if (!form.date) {
      setErrors({ date: '날짜를 선택해 주세요.' });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      const usedHistoryTopics = items
        .filter((item) => item.type === 'history')
        .flatMap((item) => [item.title, item.subTopic])
        .filter(Boolean);

      const result = generateHistoryPrompt(form, usedHistoryTopics);
      onGenerated(result);
    } catch (err) {
      onError(err instanceof Error ? err.message : '프롬프트 생성 중 오류 발생');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formBody}>
      <div className={styles.fieldRow}>
        <Input
          label="날짜 기준"
          type="date"
          value={form.date}
          max={getMaxNextMonthString()}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          fullWidth
          error={errors.date}
        />
      </div>
      <div className={styles.toggleGroup}>
        <Toggle
          label="대한민국 사건 우선"
          description="국내 주요 사건을 먼저 다루고 이후 세계사적 사건을 포함합니다"
          checked={form.koreaFirst}
          onChange={(v) => setForm((f) => ({ ...f, koreaFirst: v }))}
        />
        <Toggle
          label="이미지 프롬프트 포함"
          description="썸네일과 핵심 사건 중심으로 이미지 프롬프트를 함께 생성합니다"
          checked={form.includeImage}
          onChange={(v) => setForm((f) => ({ ...f, includeImage: v }))}
        />
      </div>

      <Button
        onClick={handleSubmit}
        loading={isLoading}
        fullWidth
        size="lg"
        type="button"
      >
        🚀 프롬프트 생성
      </Button>
    </div>
  );
};

export default HistoryDraftForm;
