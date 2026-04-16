// =============================================================
// src/components/draft/GeneralDraftForm.tsx
// 역할: 일반 주제형 프롬프트 생성 입력 폼
// 주요 기능:
//   - 메인 주제 선택 → 세부 주제 자동/수동 선택
//   - 톤, HTML 유도, 이미지 포함 여부 설정
//   - 중복 체크 후 프롬프트 생성
// =============================================================

import React, { useState, useEffect } from 'react';
import Select from '@/components/common/Select';
import Input from '@/components/common/Input';
import Toggle from '@/components/common/Toggle';
import Button from '@/components/common/Button';
import type { GeneralDraftForm as FormType, GeneratedPrompt } from '@/types';
import { getMainTopics, getSubTopics } from '@/data/topicPool';
import { pickSubTopic } from '@/utils/promptGenerator';
import { generateGeneralPrompt } from '@/utils/promptGenerator';
import { checkDuplicate } from '@/utils/duplicateCheck';
import { useRegistryStore } from '@/store/useRegistryStore';
import styles from './DraftForm.module.scss';

interface Props {
  onGenerated: (result: GeneratedPrompt) => void;
  onDuplicateWarning: (msg: string) => void;
  onError: (msg: string) => void;
}

const TONE_OPTIONS = [
  { value: 'blog', label: '블로그형 (친근한 말투)' },
  { value: 'info', label: '정보형 (객관적 문체)' },
];

const GeneralDraftForm: React.FC<Props> = ({
  onGenerated,
  onDuplicateWarning,
  onError,
}) => {
  const { items, getUsedSubTopics } = useRegistryStore();

  const mainTopicOptions = getMainTopics().map((t) => ({ value: t, label: t }));

  const [form, setForm] = useState<FormType>({
    mainTopic: '',
    subTopic: '',
    tone: 'blog',
    includeHtml: false,
    includeImage: false,
  });
  const [subTopicOptions, setSubTopicOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [isManualSubTopic, setIsManualSubTopic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormType, string>>>({});

  // 메인 주제 변경 시 세부 주제 풀 업데이트 및 자동 선택
  useEffect(() => {
    if (!form.mainTopic) {
      setSubTopicOptions([]);
      setForm((f) => ({ ...f, subTopic: '' }));
      return;
    }

    const subs = getSubTopics(form.mainTopic);
    const usedSubs = getUsedSubTopics(form.mainTopic);
    const options = subs.map((s) => ({
      value: s,
      label: usedSubs.includes(s) ? `${s} (등록됨)` : s,
    }));
    setSubTopicOptions(options);

    if (!isManualSubTopic) {
      const auto = pickSubTopic(form.mainTopic, usedSubs);
      setForm((f) => ({ ...f, subTopic: auto }));
    }
  }, [form.mainTopic, isManualSubTopic, getUsedSubTopics]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormType, string>> = {};
    if (!form.mainTopic) newErrors.mainTopic = '메인 주제를 선택해 주세요.';
    if (!form.subTopic.trim()) newErrors.subTopic = '세부 주제를 입력해 주세요.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);

    try {
      const result = generateGeneralPrompt(form);

      // 중복 체크
      const dupCheck = checkDuplicate(
        result.subTopic,
        result.title,
        result.keywords,
        items
      );

      if (dupCheck.isDuplicate) {
        onDuplicateWarning(
          `⚠️ 중복 감지: ${dupCheck.reason ?? '유사 항목이 존재합니다.'}`
        );
      }

      onGenerated(result);
    } catch (err) {
      onError(err instanceof Error ? err.message : '프롬프트 생성 중 오류 발생');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoPickAgain = () => {
    if (!form.mainTopic) return;
    const usedSubs = getUsedSubTopics(form.mainTopic);
    const auto = pickSubTopic(form.mainTopic, usedSubs);
    setForm((f) => ({ ...f, subTopic: auto }));
    setIsManualSubTopic(false);
  };

  return (
    <div className={styles.formBody}>
      <div className={styles.fieldRow}>
        <Select
          label="메인 주제"
          options={mainTopicOptions}
          value={form.mainTopic}
          onChange={(e) =>
            setForm((f) => ({ ...f, mainTopic: e.target.value, subTopic: '' }))
          }
          placeholder="주제를 선택하세요"
          fullWidth
          error={errors.mainTopic}
        />
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.subTopicGroup}>
          {isManualSubTopic ? (
            <Input
              label="세부 주제 (직접 입력)"
              value={form.subTopic}
              onChange={(e) =>
                setForm((f) => ({ ...f, subTopic: e.target.value }))
              }
              placeholder="세부 주제를 직접 입력하세요"
              fullWidth
              error={errors.subTopic}
            />
          ) : (
            <Select
              label="세부 주제"
              options={subTopicOptions}
              value={form.subTopic}
              onChange={(e) =>
                setForm((f) => ({ ...f, subTopic: e.target.value }))
              }
              placeholder={
                form.mainTopic ? '자동 선택됨' : '메인 주제를 먼저 선택하세요'
              }
              fullWidth
              error={errors.subTopic}
              disabled={!form.mainTopic}
            />
          )}
          <div className={styles.subTopicActions}>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={handleAutoPickAgain}
              disabled={!form.mainTopic}
            >
              🔀 자동 선택
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => {
                setIsManualSubTopic((v) => !v);
                setForm((f) => ({ ...f, subTopic: '' }));
              }}
            >
              {isManualSubTopic ? '📋 목록에서 선택' : '✏️ 직접 입력'}
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.fieldRow}>
        <Select
          label="톤 선택"
          options={TONE_OPTIONS}
          value={form.tone}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              tone: e.target.value as FormType['tone'],
            }))
          }
          fullWidth
        />
      </div>

      <div className={styles.toggleGroup}>
        <Toggle
          label="HTML 결과 유도"
          description="AI가 HTML 형식으로 결과를 작성하도록 프롬프트에 포함합니다"
          checked={form.includeHtml}
          onChange={(v) => setForm((f) => ({ ...f, includeHtml: v }))}
        />
        <Toggle
          label="이미지 프롬프트 포함"
          description="각 섹션에 어울리는 이미지 프롬프트를 함께 생성합니다"
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

export default GeneralDraftForm;
