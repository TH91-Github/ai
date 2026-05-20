import React, { useEffect, useState } from 'react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import type { SongRegistryItem, SongRegistryStatus } from '@/types';
import styles from './SongRegistryModal.module.scss';

interface FormState {
  title: string;
  status: SongRegistryStatus;
  promptText: string;
  url: string;
}

interface Props {
  mode: 'create' | 'detail';
  item?: SongRegistryItem | null;
  open: boolean;
  saving?: boolean;
  deleting?: boolean;
  onClose: () => void;
  onCreate?: (value: FormState) => Promise<void> | void;
  onUpdate?: (id: string, value: FormState) => Promise<void> | void;
  onDelete?: (id: string) => Promise<void> | void;
  onCopy?: (value: string) => Promise<void> | void;
}

const EMPTY_FORM: FormState = {
  title: '',
  status: 'unregistered',
  promptText: '',
  url: '',
};

const SongRegistryModal: React.FC<Props> = ({
  mode,
  item,
  open,
  saving = false,
  deleting = false,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
  onCopy,
}) => {
  const [isEditing, setIsEditing] = useState(mode === 'create');
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;

    if (mode === 'create') {
      setIsEditing(true);
      setForm(EMPTY_FORM);
      setError('');
      return;
    }

    setIsEditing(false);
    setForm(
      item
        ? {
            title: item.title,
            status: item.status,
            promptText: item.promptText,
            url: item.url,
          }
        : EMPTY_FORM
    );
    setError('');
  }, [item, mode, open]);

  if (!open) return null;

  const validate = () => {
    if (!form.title.trim()) return '타이틀을 입력해 주세요.';
    if (!form.promptText.trim()) return '프롬프트를 입력해 주세요.';
    return '';
  };

  const handleSubmit = async () => {
    const nextError = validate();
    setError(nextError);
    if (nextError) return;

    if (mode === 'create') {
      await onCreate?.({
        title: form.title.trim(),
        status: form.status,
        promptText: form.promptText.trim(),
        url: form.url.trim(),
      });
      return;
    }

    if (!item) return;

    await onUpdate?.(item.id, {
      title: form.title.trim(),
      status: form.status,
      promptText: form.promptText.trim(),
      url: form.url.trim(),
    });
    setIsEditing(false);
  };

  const isReadOnly = mode === 'detail' && !isEditing;

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <h2>{mode === 'create' ? '노래 등록' : '노래 상세 정보'}</h2>
          {mode === 'detail' && (
            <Button variant={isEditing ? 'secondary' : 'ghost'} size="sm" type="button" onClick={() => setIsEditing((prev) => !prev)}>
              {isEditing ? '보기' : '편집'}
            </Button>
          )}
        </div>

        <div className={styles.body}>
          <Input
            label="타이틀"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            fullWidth
            disabled={isReadOnly}
          />

          <div className={styles.field}>
            <span className={styles.label}>상태</span>
            <div className={styles.statusGroup}>
              {[
                { value: 'registered', label: '등록' },
                { value: 'unregistered', label: '미등록' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={form.status === option.value ? styles.statusActive : styles.statusButton}
                  onClick={() => !isReadOnly && setForm((prev) => ({ ...prev, status: option.value as SongRegistryStatus }))}
                  disabled={isReadOnly}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <span className={styles.label}>프롬프트</span>
              {mode === 'detail' && form.promptText && (
                <Button variant="ghost" size="sm" type="button" onClick={() => onCopy?.(form.promptText)}>
                  복사
                </Button>
              )}
            </div>
            <textarea
              className={styles.textarea}
              value={form.promptText}
              onChange={(event) => setForm((prev) => ({ ...prev, promptText: event.target.value }))}
              disabled={isReadOnly}
            />
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <span className={styles.label}>URL</span>
              {mode === 'detail' && form.url && (
                <a href={form.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  새창 열기
                </a>
              )}
            </div>
            <Input
              value={form.url}
              onChange={(event) => setForm((prev) => ({ ...prev, url: event.target.value }))}
              placeholder="https://..."
              fullWidth
              disabled={isReadOnly}
            />
          </div>

          {mode === 'detail' && (
            <div className={styles.copyRow}>
              <Button variant="secondary" size="sm" type="button" onClick={() => onCopy?.(form.title)}>
                타이틀 복사
              </Button>
              <Button variant="secondary" size="sm" type="button" onClick={() => onCopy?.(form.promptText)}>
                프롬프트 복사
              </Button>
            </div>
          )}

          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.footer}>
          {mode === 'detail' && onDelete && item && (
            <Button variant="danger" type="button" onClick={() => onDelete(item.id)} loading={deleting}>
              삭제
            </Button>
          )}
          <Button variant="secondary" type="button" onClick={onClose}>
            취소
          </Button>
          <Button type="button" onClick={handleSubmit} loading={saving}>
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SongRegistryModal;
