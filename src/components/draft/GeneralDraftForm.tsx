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
import type { BlogRegistryItem, GeneralDraftForm as FormType, GeneratedPrompt } from '@/types';
import { getMainTopics } from '@/data/topicPool';
import { generateGeneralPrompt } from '@/utils/promptGenerator';
import { checkDuplicate } from '@/utils/duplicateCheck';
import { useRegistryStore } from '@/store/useRegistryStore';
import styles from './DraftForm.module.scss';

interface Props {
  onGenerated: (result: GeneratedPrompt, mainTopic: string) => void;
  onDuplicateWarning: (msg: string) => void;
  onError: (msg: string) => void;
}

const GeneralDraftForm: React.FC<Props> = ({
  onGenerated,
  onDuplicateWarning,
  onError,
}) => {
  const { items, fetchItems } = useRegistryStore();

  const mainTopicOptions = getMainTopics().map((t) => ({ value: t, label: t }));

  const [form, setForm] = useState<FormType>({
    mainTopic: '',
    includeHtml: true,
    includeImage: true,
  });
  const [isManualMainTopic, setIsManualMainTopic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormType, string>>>({});

  useEffect(() => {
    fetchItems('blog').catch(() => {
      // 초안 생성은 계속 가능하게 두고, 중복 참고 목록만 비워 둡니다.
    });
  }, [fetchItems]);

  useEffect(() => {
    setErrors({});
  }, [form.mainTopic]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormType, string>> = {};
    if (!form.mainTopic.trim()) newErrors.mainTopic = '메인 주제를 입력해 주세요.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);

    try {
      const existingBlogs = items
        .filter((item): item is BlogRegistryItem => item.category === 'blog')
        .map((item) => ({
          title: item.title,
          subTopic: item.subTopic,
          url: item.url,
        }));

      const result = generateGeneralPrompt(form, existingBlogs);

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

      onGenerated(result, form.mainTopic.trim());
    } catch (err) {
      onError(err instanceof Error ? err.message : '프롬프트 생성 중 오류 발생');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formBody}>
      <div className={styles.fieldRow}>
        <div className={styles.subTopicGroup}>
          {isManualMainTopic ? (
            <Input
              label="메인 주제 (직접 입력)"
              value={form.mainTopic}
              onChange={(e) =>
                setForm((f) => ({ ...f, mainTopic: e.target.value }))
              }
              placeholder="예: 건강, 재테크, 반려동물, 공부 습관"
              fullWidth
              error={errors.mainTopic}
            />
          ) : (
            <Select
              label="메인 주제"
              options={mainTopicOptions}
              value={form.mainTopic}
              onChange={(e) =>
                setForm((f) => ({ ...f, mainTopic: e.target.value }))
              }
              placeholder="주제를 선택하세요"
              fullWidth
              error={errors.mainTopic}
            />
          )}
          <div className={styles.subTopicActions}>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => {
                setIsManualMainTopic((v) => !v);
                setForm((f) => ({ ...f, mainTopic: '' }));
              }}
            >
              {isManualMainTopic ? '📋 목록에서 선택' : '✏️ 직접 입력'}
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.toggleGroup}>
        <Toggle
          label="이미지 프롬프트 포함"
          description="필요한 위치에만 이미지 프롬프트를 넣고, 개수는 내용에 따라 AI가 판단합니다"
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
