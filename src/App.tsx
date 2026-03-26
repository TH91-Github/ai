import { useEffect, useState } from 'react'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

const HOME_PATH = '/'

function App() {
  const [pathname, setPathname] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const navigateHome = () => {
    window.history.replaceState(null, '', HOME_PATH)
    setPathname(HOME_PATH)
  }

  if (pathname !== HOME_PATH) {
    return <NotFoundPage onNavigateHome={navigateHome} />
  }

  return <HomePage />
}

export default App
