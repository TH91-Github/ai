import type { BlogPostRecord } from '../types/blogPost'

type ExistingPostHintsProps = {
  posts: BlogPostRecord[]
}

function ExistingPostHints({ posts }: ExistingPostHintsProps) {
  if (posts.length === 0) {
    return null
  }

  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
      <p className="text-sm font-semibold text-amber-900">비슷한 제목이 이미 등록되어 있습니다.</p>
      <p className="mt-1 text-xs leading-5 text-amber-800">
        새 글을 쓰기 전에 중복 여부를 한 번 더 확인해보세요.
      </p>
      <div className="mt-3 space-y-2">
        {posts.slice(0, 3).map((post) => (
          <a
            key={post.id}
            href={post.url}
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl border border-amber-100 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-amber-300"
          >
            <p className="font-medium text-slate-900">{post.title}</p>
            <p className="mt-1 text-xs text-slate-500">{post.url}</p>
          </a>
        ))}
      </div>
    </section>
  )
}

export default ExistingPostHints
