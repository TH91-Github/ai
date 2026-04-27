// =============================================================
// src/components/registry/RegistryCard.tsx
// 역할: 등록 목록 개별 항목 카드 컴포넌트
// 주요 기능: 항목 정보 표시, 삭제, URL 링크 이동
// =============================================================

import React, { useState } from 'react';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import type { RegistryItem } from '@/types';
import styles from './RegistryCard.module.scss';

interface Props {
  item: RegistryItem;
  onDelete: (id: string) => void;
}

const TYPE_LABELS: Record<RegistryItem['type'], string> = {
  general: '일반 주제형',
  history: '오늘의 역사형',
  song: '노래',
  video: '영상',
};

const RegistryCard: React.FC<Props> = ({ item, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete(item.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000); // 3초 후 취소
    }
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
          <Badge color="primary">{item.mainTopic}</Badge>
          <Badge color="neutral">{TYPE_LABELS[item.type]}</Badge>
          <span className={styles.date}>{formattedDate}</span>
        </div>
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
      </div>

      <div className={styles.keywords}>
        {item.keywords.map((kw) => (
          <Badge key={kw} color="neutral">
            {kw}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default RegistryCard;
