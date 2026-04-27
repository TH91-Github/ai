import React, { useState } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import type { VideoDraftForm as FormType, GeneratedPrompt } from '@/types';
import { generateVideoPrompt } from '@/utils/promptGenerator';
import styles from './DraftForm.module.scss';

interface Props {
  onGenerated: (result: GeneratedPrompt) => void;
  onError: (msg: string) => void;
}

const VideoDraftForm: React.FC<Props> = ({ onGenerated, onError }) => {
  const [form, setForm] = useState<FormType>({
    topic: '',
    platform: '',
    style: '',
    duration: '',
    tone: '',
    audience: '',
    format: '',
    keywords: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.topic.trim()) {
      onError('주제를 입력해 주세요.');
      return;
    }

    setIsLoading(true);
    try {
      onGenerated(generateVideoPrompt(form));
    } catch (error) {
      onError(error instanceof Error ? error.message : '영상 프롬프트 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formBody}>
      <div className={styles.fieldRow}>
        <Input label="주제" value={form.topic} onChange={(e) => setForm((prev) => ({ ...prev, topic: e.target.value }))} placeholder="예: 여행 브이로그 오프닝" fullWidth />
        <Input label="플랫폼" value={form.platform} onChange={(e) => setForm((prev) => ({ ...prev, platform: e.target.value }))} placeholder="예: YouTube Shorts, Reels" fullWidth />
      </div>

      <div className={styles.fieldRow}>
        <Input label="스타일" value={form.style} onChange={(e) => setForm((prev) => ({ ...prev, style: e.target.value }))} placeholder="예: cinematic, clean" fullWidth />
        <Input label="길이" value={form.duration} onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))} placeholder="예: 30초, 1분" fullWidth />
      </div>

      <div className={styles.fieldRow}>
        <Input label="톤" value={form.tone} onChange={(e) => setForm((prev) => ({ ...prev, tone: e.target.value }))} placeholder="예: 감각적, 차분함" fullWidth />
        <Input label="대상 시청자" value={form.audience} onChange={(e) => setForm((prev) => ({ ...prev, audience: e.target.value }))} placeholder="예: 20대 직장인" fullWidth />
      </div>

      <div className={styles.fieldRow}>
        <Input label="구성 형식" value={form.format} onChange={(e) => setForm((prev) => ({ ...prev, format: e.target.value }))} placeholder="예: hook - body - ending CTA" fullWidth />
        <Input label="추가 키워드" value={form.keywords} onChange={(e) => setForm((prev) => ({ ...prev, keywords: e.target.value }))} placeholder="쉼표로 구분해 입력" fullWidth />
      </div>

      <Button onClick={handleSubmit} loading={isLoading} fullWidth size="lg" type="button">
        🎬 프롬프트 생성
      </Button>
    </div>
  );
};

export default VideoDraftForm;
