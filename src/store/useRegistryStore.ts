// =============================================================
// src/store/useRegistryStore.ts
// 역할: 등록 목록 상태 관리 (Zustand + localStorage persist)
// 주의: 상태 변경 시 localStorage에 자동 동기화됨
// =============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RegistryItem } from '@/types';
import { generateId } from '@/utils/promptGenerator';

interface RegistryStore {
  items: RegistryItem[];
  addItem: (item: Omit<RegistryItem, 'id' | 'createdAt'>) => void;
  updateItem: (
    id: string,
    updates: Pick<RegistryItem, 'title' | 'mainTopic' | 'subTopic' | 'url' | 'keywords'>
  ) => void;
  removeItem: (id: string) => void;
  searchItems: (query: string) => RegistryItem[];
  getUsedSubTopics: (mainTopic?: string) => string[];
}

export const useRegistryStore = create<RegistryStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const newItem: RegistryItem = {
          ...item,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ items: [newItem, ...state.items] }));
      },

      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...updates,
                }
              : item
          ),
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      searchItems: (query) => {
        if (!query.trim()) return get().items;
        const q = query.toLowerCase();
        return get().items.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            item.mainTopic.toLowerCase().includes(q) ||
            item.subTopic.toLowerCase().includes(q) ||
            item.keywords.some((k) => k.toLowerCase().includes(q))
        );
      },

      getUsedSubTopics: (mainTopic) => {
        const items = get().items;
        if (mainTopic) {
          return items
            .filter((item) => item.mainTopic === mainTopic)
            .map((item) => item.subTopic);
        }
        return items.map((item) => item.subTopic);
      },
    }),
    {
      name: 'blog-prompt-registry', // localStorage key
    }
  )
);
