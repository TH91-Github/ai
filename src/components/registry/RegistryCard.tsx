// =============================================================
// src/components/registry/RegistryCard.tsx
// 역할: 등록 목록 개별 항목 카드 컴포넌트
// 주요 기능: 항목 정보 표시, 삭제, URL 링크 이동
// =============================================================

import React, { useMemo, useState } from 'react';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import type { RegistryItem } from '@/types';
import styles from './RegistryCard.module.scss';

interface Props {
  item: RegistryItem;
  onDelete: (id: string) => void;
  onSave: (
    id: string,
    updates: Pick<RegistryItem, 'title' | 'mainTopic' | 'subTopic' | 'url' | 'keywords'>
  ) => void;
}

const TYPE_LABELS: Record<RegistryItem['type'], string> = {
  general: '일반 주제형',
  history: '오늘의 역사형',
  song: '노래',
  video: '영상',
};

const RegistryCard: React.FC<Props> = ({ item, onDelete, onSave }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    mainTopic?: string;
    subTopic?: string;
  }>({});
  const [form, setForm] = useState({
    title: item.title,
    mainTopic: item.mainTopic,
    subTopic: item.subTopic,
    url: item.url,
    keywords: item.keywords.join(', '),
  });

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete(item.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000); // 3초 후 취소
    }
  };

  const formattedKeywords = useMemo(() => item.keywords.join(', '), [item.keywords]);

  const resetForm = () => {
    setForm({
      title: item.title,
      mainTopic: item.mainTopic,
      subTopic: item.subTopic,
      url: item.url,
      keywords: formattedKeywords,
    });
    setErrors({});
  };

  const handleEditToggle = () => {
    if (isEditing) {
      resetForm();
      setIsEditing(false);
      return;
    }

    resetForm();
    setIsEditing(true);
  };

  const handleSave = () => {
    const nextErrors: typeof errors = {};

    if (!form.title.trim()) nextErrors.title = '제목을 입력해 주세요.';
    if (!form.mainTopic.trim()) nextErrors.mainTopic = '메인 주제를 입력해 주세요.';
    if (!form.subTopic.trim()) nextErrors.subTopic = '세부 주제를 입력해 주세요.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave(item.id, {
      title: form.title.trim(),
      mainTopic: form.mainTopic.trim(),
      subTopic: form.subTopic.trim(),
      url: form.url.trim(),
      keywords: form.keywords
        .split(',')
        .map((keyword) => keyword.trim())
        .filter(Boolean),
    });

    setIsEditing(false);
  };

  const formattedDate = new Date(item.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.metaRow}>
          <Badge color="primary">블로그</Badge>
          <Badge color="neutral">{TYPE_LABELS[item.type]}</Badge>
          <span className={styles.topic}>메인 주제: {item.mainTopic}</span>
          <span className={styles.date}>{formattedDate}</span>
        </div>
        <div className={styles.actions}>
          <Button variant={isEditing ? 'secondary' : 'ghost'} size="sm" onClick={handleEditToggle} type="button">
            {isEditing ? '취소' : '수정'}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDeleteClick}
            type="button"
            title={confirmDelete ? '한 번 더 클릭하면 삭제됩니다' : '삭제'}
          >
            {confirmDelete ? '⚠️ 확인 삭제' : '삭제'}
          </Button>
        </div>
      </div>

      {isEditing ? (
        <div className={styles.editForm}>
          <div className={styles.editGrid}>
            <Input
              label="제목"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              error={errors.title}
              fullWidth
            />
            <Input
              label="메인 주제"
              value={form.mainTopic}
              onChange={(e) => setForm((prev) => ({ ...prev, mainTopic: e.target.value }))}
              error={errors.mainTopic}
              fullWidth
            />
            <Input
              label="세부 주제"
              value={form.subTopic}
              onChange={(e) => setForm((prev) => ({ ...prev, subTopic: e.target.value }))}
              error={errors.subTopic}
              fullWidth
            />
            <Input
              label="URL"
              value={form.url}
              onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
              placeholder="https://..."
              fullWidth
            />
            <Input
              label="키워드"
              value={form.keywords}
              onChange={(e) => setForm((prev) => ({ ...prev, keywords: e.target.value }))}
              placeholder="쉼표로 구분해 입력"
              fullWidth
            />
          </div>

          <div className={styles.editActions}>
            <Button type="button" size="sm" onClick={handleSave}>
              저장
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.cardBody}>
            <p className={styles.title}>
              {item.url ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </p>
            <p className={styles.subTopic}>세부 주제: {item.subTopic}</p>
            <p className={styles.url}>
              URL: {item.url ? item.url : '아직 입력되지 않음'}
            </p>
          </div>

          <div className={styles.keywords}>
            {item.keywords.map((kw) => (
              <Badge key={kw} color="neutral">
                {kw}
              </Badge>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RegistryCard;
