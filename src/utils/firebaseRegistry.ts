import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentData,
  type Timestamp,
} from 'firebase/firestore';
import type {
  BlogRegistryItem,
  RegistryItem,
  SongRegistryItem,
} from '@/types';
import { db } from '@/utils/firebase';

const REGISTRY_COLLECTION = 'registryItems';

type RegistrySnapshotHandlers = {
  onData: (items: RegistryItem[]) => void;
  onError: (message: string) => void;
};

type BlogRegistryInput = Omit<BlogRegistryItem, 'id' | 'createdAt' | 'updatedAt'>;
type SongRegistryInput = Omit<SongRegistryItem, 'id' | 'createdAt' | 'updatedAt'>;

const registryCollection = collection(db, REGISTRY_COLLECTION);

const toIsoString = (value: Timestamp | string | null | undefined) => {
  if (!value) return new Date().toISOString();
  if (typeof value === 'string') return value;
  return value.toDate().toISOString();
};

const toRegistryItem = (id: string, data: DocumentData): RegistryItem | null => {
  if (data.category === 'song') {
    return {
      id,
      category: 'song',
      title: typeof data.title === 'string' ? data.title : '제목 없음',
      status: data.status === 'registered' ? 'registered' : 'unregistered',
      promptText: typeof data.promptText === 'string' ? data.promptText : '',
      url: typeof data.url === 'string' ? data.url : '',
      createdAt: toIsoString(data.createdAt),
      updatedAt: toIsoString(data.updatedAt),
    };
  }

  if (data.category === 'blog') {
    return {
      id,
      category: 'blog',
      type: data.type ?? 'general',
      title: typeof data.title === 'string' ? data.title : '제목 없음',
      mainTopic: typeof data.mainTopic === 'string' ? data.mainTopic : '',
      subTopic: typeof data.subTopic === 'string' ? data.subTopic : '',
      url: typeof data.url === 'string' ? data.url : '',
      keywords: Array.isArray(data.keywords) ? data.keywords.filter((item: unknown) => typeof item === 'string') : [],
      createdAt: toIsoString(data.createdAt),
      updatedAt: toIsoString(data.updatedAt),
      songData: data.songData,
    };
  }

  return null;
};

const sanitizePayload = (payload: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));

export const fetchRegistryItems = async (
  category: RegistryItem['category'] | 'all' = 'all'
) => {
  try {
    const snapshot =
      category === 'all'
        ? await getDocs(registryCollection)
        : await getDocs(query(registryCollection, where('category', '==', category)));

    return snapshot.docs
      .map((item) => toRegistryItem(item.id, item.data()))
      .filter((item): item is RegistryItem => item !== null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    const message = error instanceof Error ? error.message : '등록 목록을 불러오지 못했어요.';
    throw new Error(message);
  }
};

export const createBlogRegistryItem = async (input: BlogRegistryInput) => {
  await addDoc(
    registryCollection,
    sanitizePayload({
      ...input,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );
};

export const createSongRegistryItem = async (input: SongRegistryInput) => {
  await addDoc(
    registryCollection,
    sanitizePayload({
      ...input,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );
};

export const updateRegistryItem = async (id: string, updates: Record<string, unknown>) => {
  await updateDoc(
    doc(db, REGISTRY_COLLECTION, id),
    sanitizePayload({
      ...updates,
      updatedAt: serverTimestamp(),
    })
  );
};

export const deleteRegistryItem = async (id: string) => {
  await deleteDoc(doc(db, REGISTRY_COLLECTION, id));
};
