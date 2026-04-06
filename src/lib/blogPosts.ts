import type { BlogPostRecord } from '../types/blogPost'

const BLOG_POSTS_STORAGE_KEY = 'prompt-builder-blog-posts'

const isBlogPostRecord = (value: unknown): value is BlogPostRecord => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.categoryId === 'string' &&
    typeof candidate.url === 'string' &&
    typeof candidate.memo === 'string' &&
    typeof candidate.createdAt === 'string'
  )
}

export const loadBlogPosts = () => {
  if (typeof window === 'undefined') {
    return [] as BlogPostRecord[]
  }

  try {
    const rawValue = window.localStorage.getItem(BLOG_POSTS_STORAGE_KEY)

    if (!rawValue) {
      return [] as BlogPostRecord[]
    }

    const parsedValue: unknown = JSON.parse(rawValue)

    if (!Array.isArray(parsedValue)) {
      return [] as BlogPostRecord[]
    }

    return parsedValue.filter(isBlogPostRecord)
  } catch (error) {
    console.error('블로그 목록 로딩에 실패했습니다.', error)
    return [] as BlogPostRecord[]
  }
}

export const saveBlogPosts = (posts: BlogPostRecord[]) => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(BLOG_POSTS_STORAGE_KEY, JSON.stringify(posts))
  } catch (error) {
    console.error('블로그 목록 저장에 실패했습니다.', error)
  }
}

export const createBlogPostRecord = (
  input: Omit<BlogPostRecord, 'id' | 'createdAt'>,
): BlogPostRecord => ({
  ...input,
  id: crypto.randomUUID(),
  createdAt: new Date().toISOString(),
})

export const normalizeKeyword = (value: string) => value.trim().toLowerCase()

export const findSimilarPosts = (posts: BlogPostRecord[], keyword: string) => {
  const normalizedKeyword = normalizeKeyword(keyword)

  if (!normalizedKeyword) {
    return [] as BlogPostRecord[]
  }

  return posts.filter((post) => normalizeKeyword(post.title).includes(normalizedKeyword))
}
