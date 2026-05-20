import { create } from 'zustand';
import type {
  BlogRegistryItem,
  RegistryItem,
  SongRegistryItem,
  SongRegistryStatus,
} from '@/types';
import {
  createBlogRegistryItem,
  createSongRegistryItem,
  deleteRegistryItem,
  fetchRegistryItems,
  updateRegistryItem,
} from '@/utils/firebaseRegistry';

type BlogRegistryCreateInput = Omit<BlogRegistryItem, 'id' | 'createdAt' | 'updatedAt'>;
type SongRegistryCreateInput = Omit<SongRegistryItem, 'id' | 'createdAt' | 'updatedAt'>;
type BlogRegistryUpdateInput = Pick<BlogRegistryItem, 'title' | 'mainTopic' | 'subTopic' | 'url' | 'keywords'>;
type SongRegistryUpdateInput = Pick<SongRegistryItem, 'title' | 'status' | 'promptText' | 'url'>;

interface RegistryStore {
  items: RegistryItem[];
  loading: boolean;
  error: string | null;
  loadedCategories: {
    blog: boolean;
    song: boolean;
    all: boolean;
  };
  fetchItems: (category?: RegistryItem['category'] | 'all', force?: boolean) => Promise<void>;
  addBlogItem: (item: BlogRegistryCreateInput) => Promise<void>;
  addSongItem: (item: SongRegistryCreateInput) => Promise<void>;
  updateBlogItem: (id: string, updates: BlogRegistryUpdateInput) => Promise<void>;
  updateSongItem: (id: string, updates: SongRegistryUpdateInput) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  searchItems: (query: string) => RegistryItem[];
  getUsedSubTopics: (mainTopic?: string) => string[];
  getSongItems: (status?: SongRegistryStatus | 'all') => SongRegistryItem[];
}

const normalizeQuery = (value: string) => value.trim().toLowerCase();

export const useRegistryStore = create<RegistryStore>()((set, get) => ({
  items: [],
  loading: false,
  error: null,
  loadedCategories: {
    blog: false,
    song: false,
    all: false,
  },

  fetchItems: async (category = 'all', force = false) => {
    const loaded = get().loadedCategories[category];
    if (loaded && !force) return;

    set({ loading: true, error: null });

    try {
      const items = await fetchRegistryItems(category);
      set((state) => ({
        items: category === 'all'
          ? items
          : [
              ...state.items.filter((item) => item.category !== category),
              ...items,
            ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        loading: false,
        error: null,
        loadedCategories: {
          ...state.loadedCategories,
          [category]: true,
        },
      }));
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : '등록 목록을 불러오지 못했어요.',
      });
    }
  },

  addBlogItem: async (item) => {
    await createBlogRegistryItem(item);
    set((state) => ({
      loadedCategories: {
        ...state.loadedCategories,
        blog: false,
        all: false,
      },
    }));
  },

  addSongItem: async (item) => {
    await createSongRegistryItem(item);
    set((state) => ({
      loadedCategories: {
        ...state.loadedCategories,
        song: false,
        all: false,
      },
    }));
  },

  updateBlogItem: async (id, updates) => {
    await updateRegistryItem(id, updates);
    set((state) => ({
      items: state.items.map((item) =>
        item.category === 'blog' && item.id === id
          ? {
              ...item,
              ...updates,
            }
          : item
      ),
      loadedCategories: {
        ...state.loadedCategories,
        blog: false,
        all: false,
      },
    }));
  },

  updateSongItem: async (id, updates) => {
    await updateRegistryItem(id, updates);
    set((state) => ({
      items: state.items.map((item) =>
        item.category === 'song' && item.id === id
          ? {
              ...item,
              ...updates,
            }
          : item
      ),
      loadedCategories: {
        ...state.loadedCategories,
        song: false,
        all: false,
      },
    }));
  },

  removeItem: async (id) => {
    const target = get().items.find((item) => item.id === id);
    await deleteRegistryItem(id);
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
      loadedCategories: {
        ...state.loadedCategories,
        all: false,
        blog: target?.category === 'blog' ? false : state.loadedCategories.blog,
        song: target?.category === 'song' ? false : state.loadedCategories.song,
      },
    }));
  },

  searchItems: (query) => {
    const normalized = normalizeQuery(query);
    if (!normalized) return get().items;

    return get().items.filter((item) => {
      if (item.category === 'song') {
        return [
          item.title,
          item.promptText,
          item.url,
          item.status === 'registered' ? '등록' : '미등록',
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalized));
      }

      return [
        item.title,
        item.mainTopic,
        item.subTopic,
        item.url,
        ...item.keywords,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalized));
    });
  },

  getUsedSubTopics: (mainTopic) => {
    const blogItems = get().items.filter((item): item is BlogRegistryItem => item.category === 'blog');
    if (mainTopic) {
      return blogItems
        .filter((item) => item.mainTopic === mainTopic)
        .map((item) => item.subTopic);
    }

    return blogItems.map((item) => item.subTopic);
  },

  getSongItems: (status = 'all') => {
    const songItems = get().items.filter((item): item is SongRegistryItem => item.category === 'song');
    if (status === 'all') return songItems;
    return songItems.filter((item) => item.status === status);
  },
}));
