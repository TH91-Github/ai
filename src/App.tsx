import { useEffect, useState } from 'react'
import AppHeader from './components/AppHeader'
import { loadBlogPosts, saveBlogPosts } from './lib/blogPosts'
import BlogLibraryPage from './pages/BlogLibraryPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import type { BlogPostRecord } from './types/blogPost'

const HOME_PATH = '/'
const LIBRARY_PATH = '/library'

function App() {
  const [pathname, setPathname] = useState(window.location.pathname)
  const [posts, setPosts] = useState<BlogPostRecord[]>(() => loadBlogPosts())

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const navigateTo = (path: string) => {
    window.history.pushState(null, '', path)
    setPathname(path)
  }

  const handleAddPost = (post: BlogPostRecord) => {
    const nextPosts = [...posts, post]
    setPosts(nextPosts)
    saveBlogPosts(nextPosts)
  }

  if (pathname !== HOME_PATH && pathname !== LIBRARY_PATH) {
    return <NotFoundPage onNavigateHome={() => navigateTo(HOME_PATH)} />
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.12),_transparent_24%),linear-gradient(180deg,_#fffdf8_0%,_#f8fafc_52%,_#f1f5f9_100%)] px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <AppHeader pathname={pathname} onNavigate={navigateTo} />
        {pathname === HOME_PATH ? <HomePage posts={posts} /> : null}
        {pathname === LIBRARY_PATH ? (
          <BlogLibraryPage posts={posts} onAddPost={handleAddPost} />
        ) : null}
      </div>
    </div>
  )
}

export default App
