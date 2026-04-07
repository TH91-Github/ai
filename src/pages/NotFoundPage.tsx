import { useEffect, useState } from 'react'

type NotFoundPageProps = {
  onNavigateHome: () => void
}

function NotFoundPage({ onNavigateHome }: NotFoundPageProps) {
  const [secondsLeft, setSecondsLeft] = useState(5)

  useEffect(() => {
    const countdownTimer = window.setInterval(() => {
      setSecondsLeft((currentValue) => {
        if (currentValue <= 1) {
          window.clearInterval(countdownTimer)
          onNavigateHome()
          return 0
        }

        return currentValue - 1
      })
    }, 1000)

    return () => window.clearInterval(countdownTimer)
  }, [onNavigateHome])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.16),_transparent_25%),linear-gradient(180deg,_#fffaf8_0%,_#f8fafc_100%)] px-4 py-10">
      <section className="w-full max-w-xl rounded-[32px] border border-slate-200 bg-white/90 p-8 text-center shadow-[var(--soft-directional-shadow-strong)] backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-500">
          Invalid Path
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          잘못된 경로 또는 이용할 수 없는 경로입니다
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          홈으로{' '}
          <span className="inline-flex min-w-8 justify-center rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">
            {secondsLeft}
          </span>
          초 후 돌아갑니다.
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          주소를 다시 확인하거나 아래 버튼으로 바로 홈 화면으로 이동할 수 있습니다.
        </p>

        <div className="mt-8">
          <button
            type="button"
            onClick={onNavigateHome}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            지금 홈으로 이동
          </button>
        </div>
      </section>
    </main>
  )
}

export default NotFoundPage
