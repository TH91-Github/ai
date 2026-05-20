import React from 'react';
import Button from '@/components/common/Button';
import styles from './DuplicateUrlModal.module.scss';

interface Props {
  open: boolean;
  title: string;
  message?: string;
  matchedTitle?: string;
  matchedUrl?: string;
  onClose: () => void;
}

const DuplicateUrlModal: React.FC<Props> = ({
  open,
  title,
  message = '동일한 URL이 이미 등록되어 있어요.',
  matchedTitle,
  matchedUrl,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <h2>{title}</h2>
        </div>

        <div className={styles.body}>
          <p className={styles.message}>{message}</p>
          {matchedTitle && (
            <div className={styles.infoBlock}>
              <span className={styles.label}>제목</span>
              <strong className={styles.value}>{matchedTitle}</strong>
            </div>
          )}
          {matchedUrl && (
            <div className={styles.infoBlock}>
              <span className={styles.label}>URL</span>
              <a href={matchedUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                {matchedUrl}
              </a>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <Button type="button" onClick={onClose}>
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DuplicateUrlModal;
