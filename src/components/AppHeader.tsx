type AppHeaderProps = {
  pathname: string
  onNavigate: (path: string) => void
}

const navigationItems = [
  { path: '/', label: '초안 작성' },
  { path: '/library', label: '블로그 목록' },
]

function AppHeader({ pathname, onNavigate }: AppHeaderProps) {
  return (
    <header className="mb-4 rounded-[22px] border border-white/80 bg-white/85 p-3 shadow-[var(--soft-directional-shadow)] backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-600">
            Prompt Draft Builder
          </p>
          <h1 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
            블로그 초안과 등록 목록을 한곳에서 관리합니다.
          </h1>
        </div>

        <nav className="flex gap-2">
          {navigationItems.map((item) => {
            const isActive = item.path === pathname

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => onNavigate(item.path)}
                className={[
                  'rounded-xl px-4 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                ].join(' ')}
              >
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

export default AppHeader
