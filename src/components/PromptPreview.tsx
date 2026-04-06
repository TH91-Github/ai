type PromptPreviewProps = {
  categoryName: string
  prompt: string
  copied: boolean
  onCopy: () => void
  onReset: () => void
}

function PromptPreview({
  categoryName,
  prompt,
  copied,
  onCopy,
  onReset,
}: PromptPreviewProps) {
  return (
    <section className="flex min-h-[360px] flex-col rounded-[24px] border border-slate-200 bg-slate-950 p-4 text-white shadow-2xl shadow-slate-950/10 md:p-5">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
            Prompt Result
          </p>
          <h2 className="mt-2 text-lg font-semibold text-white">{categoryName} 프롬프트 초안</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            완료 버튼을 누른 뒤 복사 가능한 최종 프롬프트 초안이 여기에 생성됩니다.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            초기화
          </button>
          <button
            type="button"
            onClick={onCopy}
            disabled={!prompt}
            className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            {copied ? '복사 완료' : '복사'}
          </button>
        </div>
      </div>

      <div className="mt-3 flex-1 overflow-hidden rounded-2xl bg-white/5 p-4">
        <pre className="h-full overflow-auto whitespace-pre-wrap break-words text-sm leading-6 text-slate-100">
          {prompt || '카테고리를 고르고 필요한 값을 입력한 뒤 완료를 누르면, 다른 AI에 바로 붙여넣을 수 있는 한국어 프롬프트 초안이 여기에 생성됩니다.'}
        </pre>
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-400">
        생성된 문구를 검수한 뒤 ChatGPT, Gemini, Claude 같은 외부 AI 서비스에 그대로 붙여넣는 흐름을 전제로 구성했습니다.
      </p>
    </section>
  )
}

export default PromptPreview
