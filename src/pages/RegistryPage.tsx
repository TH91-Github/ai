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
import Toast from '@/components/common/Toast';
import { useRegistryStore } from '@/store/useRegistryStore';
import { useToast } from '@/hooks/useToast';
import styles from './RegistryPage.module.scss';

const RegistryPage: React.FC = () => {
  const { items, removeItem, searchItems } = useRegistryStore();
  const [query, setQuery] = useState('');
  const { toasts, show: showToast, remove: removeToast } = useToast();

  const displayed = useMemo(
    () => searchItems(query),
    [query, searchItems, items] // items 변경 시 재계산
  );

  const handleDelete = (id: string) => {
    removeItem(id);
    showToast('항목이 삭제되었습니다', 'success');
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
            <RegistryCard key={item.id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RegistryPage;
