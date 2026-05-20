import React, { useEffect, useMemo, useState } from 'react';
import RegistryCard from '@/components/registry/RegistryCard';
import SongRegistryCard from '@/components/registry/SongRegistryCard';
import SongRegistryModal from '@/components/registry/SongRegistryModal';
import DuplicateUrlModal from '@/components/common/DuplicateUrlModal';
import Input from '@/components/common/Input';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Toast from '@/components/common/Toast';
import { useToast } from '@/hooks/useToast';
import { useRegistryStore } from '@/store/useRegistryStore';
import type {
  BlogRegistryItem,
  SongRegistryItem,
  SongRegistryStatus,
} from '@/types';
import styles from './RegistryPage.module.scss';

type MainTab = 'blog' | 'song';
type BlogView = 'register' | 'list';
type SongTab = 'all' | SongRegistryStatus;
const BLOG_PAGE_SIZE = 10;
const normalizeUrl = (value: string) => value.trim().toLowerCase().replace(/\/+$/, '');
const getUrlOrderValue = (url: string) => {
  const match = url.trim().match(/\/(\d+)(?:[/?#].*)?$/);
  return match ? Number(match[1]) : -1;
};

const getErrorMessage = (error: unknown) => {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';

  if (code.includes('permission-denied')) {
    return '관리자 계정으로 로그인한 뒤 다시 시도해 주세요.';
  }

  return error instanceof Error ? error.message : '요청 처리 중 오류가 발생했어요.';
};

const RegistryPage: React.FC = () => {
  const {
    items,
    loading,
    error,
    searchItems,
    fetchItems,
    addBlogItem,
    addSongItem,
    updateBlogItem,
    updateSongItem,
    removeItem,
  } = useRegistryStore();
  const { toasts, show: showToast, remove: removeToast } = useToast();

  const [query, setQuery] = useState('');
  const [mainTab, setMainTab] = useState<MainTab>('blog');
  const [blogView, setBlogView] = useState<BlogView>('register');
  const [songTab, setSongTab] = useState<SongTab>('all');
  const [blogPage, setBlogPage] = useState(1);
  const [registeringBlog, setRegisteringBlog] = useState(false);
  const [songModalOpen, setSongModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<SongRegistryItem | null>(null);
  const [songModalSaving, setSongModalSaving] = useState(false);
  const [songModalDeleting, setSongModalDeleting] = useState(false);
  const [duplicateModal, setDuplicateModal] = useState<{
    open: boolean;
    title: string;
    matchedTitle?: string;
    matchedUrl?: string;
  }>({
    open: false,
    title: '',
  });
  const [form, setForm] = useState({
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

  const searchedItems = useMemo(() => searchItems(query), [query, searchItems, items]);
  const blogItems = useMemo(
    () =>
      searchedItems
        .filter((item): item is BlogRegistryItem => item.category === 'blog')
        .sort((a, b) => {
          const aOrder = getUrlOrderValue(a.url);
          const bOrder = getUrlOrderValue(b.url);

          if (aOrder !== bOrder) return bOrder - aOrder;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }),
    [searchedItems]
  );
  const songItems = useMemo(
    () =>
      searchedItems
        .filter((item): item is SongRegistryItem => item.category === 'song')
        .filter((item) => (songTab === 'all' ? true : item.status === songTab)),
    [searchedItems, songTab]
  );
  const blogPageCount = Math.max(1, Math.ceil(blogItems.length / BLOG_PAGE_SIZE));
  const pagedBlogItems = useMemo(
    () => blogItems.slice((blogPage - 1) * BLOG_PAGE_SIZE, blogPage * BLOG_PAGE_SIZE),
    [blogItems, blogPage]
  );

  useEffect(() => {
    setBlogPage(1);
  }, [query, blogView]);

  useEffect(() => {
    if (blogPage > blogPageCount) {
      setBlogPage(blogPageCount);
    }
  }, [blogPage, blogPageCount]);

  const handleDeleteBlog = async (id: string) => {
    try {
      await removeItem(id);
      showToast('블로그 항목이 삭제되었어요.', 'success');
    } catch (nextError) {
      showToast(getErrorMessage(nextError), 'error');
    }
  };

  const handleOpenBlogList = async () => {
    setBlogView('list');
    await fetchItems('blog', true);
  };

  const handleOpenSongTab = async () => {
    setMainTab('song');
    await fetchItems('song', true);
  };

  const handleSaveBlog = async (
    id: string,
    updates: Pick<BlogRegistryItem, 'title' | 'mainTopic' | 'subTopic' | 'url' | 'keywords'>
  ) => {
    try {
      await updateBlogItem(id, updates);
      showToast('블로그 등록 정보를 수정했어요.', 'success');
    } catch (nextError) {
      showToast(getErrorMessage(nextError), 'error');
    }
  };

  const handleRegisterBlog = async () => {
    const nextErrors: typeof errors = {};

    if (!form.title.trim()) nextErrors.title = '제목을 입력해 주세요.';
    if (!form.mainTopic.trim()) nextErrors.mainTopic = '메인 주제를 입력해 주세요.';
    if (!form.subTopic.trim()) nextErrors.subTopic = '세부 주제를 입력해 주세요.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setRegisteringBlog(true);
    try {
      await fetchItems('blog', true);
      const normalizedUrl = normalizeUrl(form.url);
      if (normalizedUrl) {
        const duplicateItem = useRegistryStore
          .getState()
          .items
          .filter((item): item is BlogRegistryItem => item.category === 'blog')
          .find((item) => normalizeUrl(item.url) === normalizedUrl);

        if (duplicateItem) {
          setDuplicateModal({
            open: true,
            title: '동일한 URL이 이미 등록되어 있어요.',
            matchedTitle: duplicateItem.title,
            matchedUrl: duplicateItem.url,
          });
          return;
        }
      }

      await addBlogItem({
        category: 'blog',
        type: 'general',
        mainTopic: form.mainTopic.trim(),
        subTopic: form.subTopic.trim(),
        title: form.title.trim(),
        url: form.url.trim(),
        keywords: form.keywords
          .split(',')
          .map((keyword) => keyword.trim())
          .filter(Boolean),
      });
      setForm({
        title: '',
        mainTopic: '',
        subTopic: '',
        url: '',
        keywords: '',
      });
      setErrors({});
      showToast('블로그 항목을 Firebase에 등록했어요.', 'success');
    } catch (nextError) {
      showToast(getErrorMessage(nextError), 'error');
    } finally {
      setRegisteringBlog(false);
    }
  };

  const copyText = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      showToast('클립보드에 복사했어요.', 'success');
    } catch {
      showToast('복사에 실패했어요. 다시 시도해 주세요.', 'error');
    }
  };

  const handleCreateSong = async (value: {
    title: string;
    status: SongRegistryStatus;
    promptText: string;
    url: string;
  }) => {
    setSongModalSaving(true);
    try {
      await fetchItems('song', true);
      const normalizedUrl = normalizeUrl(value.url);
      if (normalizedUrl) {
        const duplicateItem = useRegistryStore
          .getState()
          .items
          .filter((item): item is SongRegistryItem => item.category === 'song')
          .find((item) => normalizeUrl(item.url) === normalizedUrl);

        if (duplicateItem) {
          setDuplicateModal({
            open: true,
            title: '동일한 URL이 이미 등록되어 있어요.',
            matchedTitle: duplicateItem.title,
            matchedUrl: duplicateItem.url,
          });
          return;
        }
      }

      await addSongItem({
        category: 'song',
        title: value.title,
        status: value.status,
        promptText: value.promptText,
        url: value.url,
      });
      setSongModalOpen(false);
      showToast('노래 항목을 등록했어요.', 'success');
    } catch (nextError) {
      showToast(getErrorMessage(nextError), 'error');
    } finally {
      setSongModalSaving(false);
    }
  };

  const handleUpdateSong = async (
    id: string,
    value: {
      title: string;
      status: SongRegistryStatus;
      promptText: string;
      url: string;
    }
  ) => {
    setSongModalSaving(true);
    try {
      await updateSongItem(id, value);
      showToast('노래 항목을 수정했어요.', 'success');
    } catch (nextError) {
      showToast(getErrorMessage(nextError), 'error');
    } finally {
      setSongModalSaving(false);
    }
  };

  const handleDeleteSong = async (id: string) => {
    setSongModalDeleting(true);
    try {
      await removeItem(id);
      setSelectedSong(null);
      showToast('노래 항목을 삭제했어요.', 'success');
    } catch (nextError) {
      showToast(getErrorMessage(nextError), 'error');
    } finally {
      setSongModalDeleting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.toastContainer}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      <div className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <h1 className={styles.pageTitle}>등록 목록</h1>
          <Badge color="primary">{items.length}개</Badge>
        </div>
        <p className={styles.pageDesc}>블로그와 노래 등록 정보를 Firebase 기준으로 관리합니다.</p>
      </div>

      <div className={styles.tabs}>
        <button
          type="button"
          className={[styles.tab, mainTab === 'blog' ? styles.active : ''].filter(Boolean).join(' ')}
          onClick={() => setMainTab('blog')}
        >
          블로그
        </button>
        <button
          type="button"
          className={[styles.tab, mainTab === 'song' ? styles.active : ''].filter(Boolean).join(' ')}
          onClick={() => {
            void handleOpenSongTab();
          }}
        >
          노래
        </button>
      </div>

      {error && <p className={styles.errorBanner}>{error}</p>}

      {(mainTab === 'song' || blogView === 'list') && (
        <div className={styles.toolbar}>
          <Input
            placeholder={mainTab === 'blog' ? '제목, 주제, 키워드로 검색...' : '타이틀, 프롬프트, URL로 검색...'}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            fullWidth
          />
          {query && (
            <span className={styles.searchResult}>
              "{query}" 검색 결과: {mainTab === 'blog' ? blogItems.length : songItems.length}건
            </span>
          )}
        </div>
      )}

      {mainTab === 'blog' ? (
        <>
          <div className={styles.blogViewBar}>
            <button
              type="button"
              className={[styles.songTab, blogView === 'register' ? styles.songTabActive : ''].filter(Boolean).join(' ')}
              onClick={() => setBlogView('register')}
            >
              블로그 등록
            </button>
            <button
              type="button"
              className={[styles.songTab, blogView === 'list' ? styles.songTabActive : ''].filter(Boolean).join(' ')}
              onClick={() => {
                void handleOpenBlogList();
              }}
            >
              목록 보기
            </button>
          </div>

          {blogView === 'register' ? (
            <div className={styles.registerBox}>
              <div className={styles.registerHeader}>
                <h2 className={styles.registerTitle}>블로그 직접 등록</h2>
                <p className={styles.registerDesc}>발행한 블로그 글을 여기서 바로 Firebase에 추가할 수 있어요.</p>
              </div>

              <div className={styles.formGrid}>
                <Input
                  label="제목"
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  error={errors.title}
                  fullWidth
                />
                <Input
                  label="메인 주제"
                  value={form.mainTopic}
                  onChange={(event) => setForm((prev) => ({ ...prev, mainTopic: event.target.value }))}
                  error={errors.mainTopic}
                  fullWidth
                />
                <Input
                  label="세부 주제"
                  value={form.subTopic}
                  onChange={(event) => setForm((prev) => ({ ...prev, subTopic: event.target.value }))}
                  error={errors.subTopic}
                  fullWidth
                />
                <Input
                  label="발행 URL"
                  value={form.url}
                  onChange={(event) => setForm((prev) => ({ ...prev, url: event.target.value }))}
                  placeholder="https://..."
                  fullWidth
                />
                <Input
                  label="키워드"
                  value={form.keywords}
                  onChange={(event) => setForm((prev) => ({ ...prev, keywords: event.target.value }))}
                  placeholder="쉼표로 구분해 입력"
                  fullWidth
                />
              </div>

              <div className={styles.registerActions}>
                <Button type="button" onClick={handleRegisterBlog} loading={registeringBlog}>
                  블로그 등록
                </Button>
              </div>
            </div>
          ) : (
            <>
              {loading && !blogItems.length ? (
                <div className={styles.empty}>
                  <span className={styles.emptyIcon}>⏳</span>
                  <p>등록 목록을 불러오는 중이에요.</p>
                </div>
              ) : blogItems.length === 0 ? (
                <div className={styles.empty}>
                  <span className={styles.emptyIcon}>📭</span>
                  <p>{query ? '검색 결과가 없습니다.' : '블로그 등록 항목이 아직 없습니다.'}</p>
                </div>
              ) : (
                <div className={styles.blogList}>
                  {pagedBlogItems.map((item) => (
                    <RegistryCard key={item.id} item={item} onDelete={handleDeleteBlog} onSave={handleSaveBlog} />
                  ))}
                </div>
              )}

              {blogItems.length > BLOG_PAGE_SIZE && (
                <div className={styles.pagination}>
                  <Button
                    variant="secondary"
                    size="sm"
                    type="button"
                    onClick={() => setBlogPage((prev) => Math.max(1, prev - 1))}
                    disabled={blogPage === 1}
                  >
                    이전
                  </Button>
                  <span className={styles.paginationText}>
                    {blogPage} / {blogPageCount}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    type="button"
                    onClick={() => setBlogPage((prev) => Math.min(blogPageCount, prev + 1))}
                    disabled={blogPage === blogPageCount}
                  >
                    다음
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <div className={styles.songTopBar}>
            <div className={styles.songTabs}>
              {[
                { key: 'all', label: '전체' },
                { key: 'unregistered', label: '미등록' },
                { key: 'registered', label: '등록' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={[styles.songTab, songTab === tab.key ? styles.songTabActive : ''].filter(Boolean).join(' ')}
                  onClick={() => setSongTab(tab.key as SongTab)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <Button type="button" onClick={() => setSongModalOpen(true)}>
              등록
            </Button>
          </div>

          {loading && !songItems.length ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>⏳</span>
              <p>노래 목록을 불러오는 중이에요.</p>
            </div>
          ) : songItems.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>🎵</span>
              <p>{query ? '검색 결과가 없습니다.' : '노래 등록 항목이 아직 없습니다.'}</p>
            </div>
          ) : (
            <div className={styles.songGrid}>
              {songItems.map((item) => (
                <SongRegistryCard key={item.id} item={item} onClick={setSelectedSong} />
              ))}
            </div>
          )}
        </>
      )}

      <SongRegistryModal
        mode="create"
        open={songModalOpen}
        saving={songModalSaving}
        onClose={() => setSongModalOpen(false)}
        onCreate={handleCreateSong}
      />

      <SongRegistryModal
        mode="detail"
        item={selectedSong}
        open={Boolean(selectedSong)}
        saving={songModalSaving}
        deleting={songModalDeleting}
        onClose={() => setSelectedSong(null)}
        onUpdate={handleUpdateSong}
        onDelete={handleDeleteSong}
        onCopy={copyText}
      />

      <DuplicateUrlModal
        open={duplicateModal.open}
        title={duplicateModal.title}
        matchedTitle={duplicateModal.matchedTitle}
        matchedUrl={duplicateModal.matchedUrl}
        onClose={() =>
          setDuplicateModal({
            open: false,
            title: '',
            matchedTitle: undefined,
            matchedUrl: undefined,
          })
        }
      />
    </div>
  );
};

export default RegistryPage;
