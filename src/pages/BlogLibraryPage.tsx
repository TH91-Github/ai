import { useMemo, useState, type FormEvent } from 'react'
import { categories } from '../data/categories'
import { createBlogPostRecord, findSimilarPosts } from '../lib/blogPosts'
import type { BlogPostRecord } from '../types/blogPost'

type BlogLibraryPageProps = {
  posts: BlogPostRecord[]
  onAddPost: (post: BlogPostRecord) => void
}

type LibraryFormState = {
  title: string
  categoryId: string
  url: string
  memo: string
}

const initialFormState: LibraryFormState = {
  title: '',
  categoryId: categories[0]?.id ?? 'development',
  url: '',
  memo: '',
}

function BlogLibraryPage({ posts, onAddPost }: BlogLibraryPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [formState, setFormState] = useState<LibraryFormState>(initialFormState)

  const filteredPosts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    if (!normalizedQuery) {
      return posts
    }

    return posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(normalizedQuery) ||
        post.url.toLowerCase().includes(normalizedQuery) ||
        post.memo.toLowerCase().includes(normalizedQuery)
      )
    })
  }, [posts, searchQuery])

  const duplicatePosts = useMemo(
    () => findSimilarPosts(posts, formState.title),
    [posts, formState.title],
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formState.title.trim() || !formState.url.trim()) {
      return
    }

    const nextPost = createBlogPostRecord({
      title: formState.title.trim(),
      categoryId: formState.categoryId as BlogPostRecord['categoryId'],
      url: formState.url.trim(),
      memo: formState.memo.trim(),
    })

    onAddPost(nextPost)
    setFormState(initialFormState)
  }

  return (
    <main className="space-y-4 text-slate-900">
      <section className="rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-lg shadow-slate-200/40">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-slate-900">블로그 등록 관리</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            제목, 카테고리, URL을 직접 등록해두면 검색으로 중복 여부를 빠르게 확인할 수 있습니다.
            지금은 로컬 저장 방식이라 이 브라우저 기준으로만 관리됩니다.
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <form
          onSubmit={handleSubmit}
          className="space-y-3 rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-lg shadow-slate-200/40"
        >
            <div>
              <p className="text-sm font-semibold text-slate-900">새 글 등록</p>
              <p className="mt-1 text-sm text-slate-500">
                배포 후 직접 목록을 관리하려면 나중에 Firebase로 옮기면 되고, 지금은 빠르게 로컬에서 운영할 수 있습니다.
              </p>
            </div>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-700">제목 *</span>
              <input
                type="text"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-400"
                value={formState.title}
                onChange={(event) =>
                  setFormState((currentValue) => ({ ...currentValue, title: event.target.value }))
                }
                placeholder="예: 웹소켓이란? 초보자용 설명 정리"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-700">카테고리</span>
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-400"
                value={formState.categoryId}
                onChange={(event) =>
                  setFormState((currentValue) => ({
                    ...currentValue,
                    categoryId: event.target.value,
                  }))
                }
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-700">URL *</span>
              <input
                type="url"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-400"
                value={formState.url}
                onChange={(event) =>
                  setFormState((currentValue) => ({ ...currentValue, url: event.target.value }))
                }
                placeholder="https://example.tistory.com/123"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-700">메모</span>
              <textarea
                rows={4}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-400"
                value={formState.memo}
                onChange={(event) =>
                  setFormState((currentValue) => ({ ...currentValue, memo: event.target.value }))
                }
                placeholder="예: 웹소켓 입문용, 이미지 없이 코드 중심"
              />
            </label>

            {duplicatePosts.length > 0 ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                비슷한 제목이 {duplicatePosts.length}개 있습니다. 등록 전 중복 여부를 확인해보세요.
              </div>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              등록하기
            </button>
        </form>

        <section className="space-y-3 rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-lg shadow-slate-200/40">
            <div>
              <p className="text-sm font-semibold text-slate-900">등록된 글 목록</p>
              <p className="mt-1 text-sm text-slate-500">
                검색으로 제목, URL, 메모를 빠르게 찾을 수 있습니다.
              </p>
            </div>

            <input
              type="search"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-400"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="제목이나 URL로 검색"
            />

            <div className="space-y-3">
              {filteredPosts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                  아직 등록된 글이 없습니다. 왼쪽 폼에서 첫 글을 등록해보세요.
                </div>
              ) : (
                filteredPosts
                  .slice()
                  .reverse()
                  .map((post) => (
                    <a
                      key={post.id}
                      href={post.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 hover:shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-900">{post.title}</p>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                          {categories.find((category) => category.id === post.categoryId)?.name ??
                            post.categoryId}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">{post.url}</p>
                      {post.memo ? <p className="mt-2 text-sm leading-6 text-slate-600">{post.memo}</p> : null}
                    </a>
                  ))
              )}
            </div>
        </section>
      </section>
    </main>
  )
}

export default BlogLibraryPage
