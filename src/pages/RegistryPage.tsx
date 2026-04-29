// =============================================================
// src/pages/RegistryPage.tsx
// 역할: 등록 목록 페이지
// 주요 기능:
//   - 등록된 항목 목록 조회 및 검색
//   - 항목 삭제
//   - 빈 상태 안내
// =============================================================

import React, { useState, useMemo } from 'react';
import RegistryCard from '@/components/registry/RegistryCard';
import Input from '@/components/common/Input';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Select from '@/components/common/Select';
import Toast from '@/components/common/Toast';
import { useRegistryStore } from '@/store/useRegistryStore';
import { useToast } from '@/hooks/useToast';
import type { BlogType } from '@/types';
import styles from './RegistryPage.module.scss';

type RegistryTab = 'all' | 'blog';

const TYPE_OPTIONS = [
  { value: 'general', label: '일반 주제형' },
  { value: 'history', label: '오늘의 역사형' },
  { value: 'song', label: '노래' },
  { value: 'video', label: '영상' },
];

const RegistryPage: React.FC = () => {
  const { items, removeItem, searchItems, addItem, updateItem } = useRegistryStore();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<RegistryTab>('all');
  const [form, setForm] = useState({
    type: 'general' as BlogType,
    title: '',
    mainTopic: '',
    subTopic: '',
    url: '',
    keywords: '',
  });
  const [errors, setErrors] = useState<{
    title?: string;
    mainTopic?: string;
    subTopic?: string;
  }>({});
  const { toasts, show: showToast, remove: removeToast } = useToast();

  const displayed = useMemo(() => {
    const searched = searchItems(query);
    if (tab === 'blog') {
      return searched.filter((item) => item.category === 'blog');
    }
    return searched;
  }, [query, searchItems, items, tab]);

  const handleDelete = (id: string) => {
    removeItem(id);
    showToast('항목이 삭제되었습니다', 'success');
  };

  const handleSave = (
    id: string,
    updates: {
      title: string;
      mainTopic: string;
      subTopic: string;
      url: string;
      keywords: string[];
    }
  ) => {
    updateItem(id, updates);
    showToast('등록 정보를 수정했습니다', 'success');
  };

  const handleRegister = () => {
    const nextErrors: typeof errors = {};

    if (!form.title.trim()) nextErrors.title = '제목을 입력해 주세요.';
    if (!form.mainTopic.trim()) nextErrors.mainTopic = '메인 주제를 입력해 주세요.';
    if (!form.subTopic.trim()) nextErrors.subTopic = '세부 주제를 입력해 주세요.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const keywords = form.keywords
      .split(',')
      .map((keyword) => keyword.trim())
      .filter(Boolean);

    addItem({
      category: 'blog',
      type: form.type,
      mainTopic: form.mainTopic.trim(),
      subTopic: form.subTopic.trim(),
      title: form.title.trim(),
      url: form.url.trim(),
      keywords,
    });

    setForm({
      type: 'general',
      title: '',
      mainTopic: '',
      subTopic: '',
      url: '',
      keywords: '',
    });
    setErrors({});
    showToast('등록 목록에 직접 추가했습니다', 'success');
  };

  return (
    <div className={styles.page}>
      {/* Toast 알림 */}
      <div className={styles.toastContainer}>
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>

      <div className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <h1 className={styles.pageTitle}>등록 목록</h1>
          <Badge color="primary">{items.length}개</Badge>
        </div>
        <p className={styles.pageDesc}>
          등록된 블로그 글을 관리하고 중복 방지에 활용합니다
        </p>
      </div>

      <div className={styles.tabs}>
        <button
          type="button"
          className={[styles.tab, tab === 'all' ? styles.active : ''].filter(Boolean).join(' ')}
          onClick={() => setTab('all')}
        >
          전체
        </button>
        <button
          type="button"
          className={[styles.tab, tab === 'blog' ? styles.active : ''].filter(Boolean).join(' ')}
          onClick={() => setTab('blog')}
        >
          블로그
        </button>
      </div>

      <div className={styles.registerBox}>
        <div className={styles.registerHeader}>
          <h2 className={styles.registerTitle}>직접 등록</h2>
          <p className={styles.registerDesc}>
            초안 만들기와 별개로, 나중에 발행한 글을 여기서 바로 추가할 수 있습니다
          </p>
        </div>

        <div className={styles.formGrid}>
          <Select
            label="유형"
            options={TYPE_OPTIONS}
            value={form.type}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                type: e.target.value as BlogType,
              }))
            }
            fullWidth
          />
          <Input
            label="제목"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="발행한 글 제목"
            fullWidth
            error={errors.title}
          />
          <Input
            label="메인 주제"
            value={form.mainTopic}
            onChange={(e) => setForm((prev) => ({ ...prev, mainTopic: e.target.value }))}
            placeholder="예: 역사, 건강, 면접"
            fullWidth
            error={errors.mainTopic}
          />
          <Input
            label="세부 주제"
            value={form.subTopic}
            onChange={(e) => setForm((prev) => ({ ...prev, subTopic: e.target.value }))}
            placeholder="예: 4월 21일 오늘의 역사"
            fullWidth
            error={errors.subTopic}
          />
          <Input
            label="발행 URL"
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

        <div className={styles.registerActions}>
          <Button type="button" onClick={handleRegister}>
            ➕ 목록에 등록
          </Button>
        </div>
      </div>

      <div className={styles.toolbar}>
        <Input
          placeholder="제목, 주제, 키워드로 검색..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
        />
        {query && (
          <span className={styles.searchResult}>
            "{query}" 검색 결과: {displayed.length}건
          </span>
        )}
      </div>

      {displayed.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📭</span>
          <p>
            {query
              ? '검색 결과가 없습니다'
              : '아직 등록된 항목이 없습니다.\n초안 만들기에서 프롬프트를 생성 후 저장해 보세요.'}
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {displayed.map((item) => (
            <RegistryCard key={item.id} item={item} onDelete={handleDelete} onSave={handleSave} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RegistryPage;
