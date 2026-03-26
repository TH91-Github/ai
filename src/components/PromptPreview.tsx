type PromptPreviewProps = {
  categoryName: string
  templateName: string
  prompt: string
  copied: boolean
  onCopy: () => void
}

function PromptPreview({
  categoryName,
  templateName,
  prompt,
  copied,
  onCopy,
}: PromptPreviewProps) {
  return (
    <section className="flex h-full flex-col rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-white shadow-2xl shadow-slate-950/10">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
            Prompt Preview
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            {categoryName} / {templateName}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            템플릿 조합 기반으로 생성된 1차 한글 프롬프트 초안입니다.
          </p>
        </div>

        <button
          type="button"
          onClick={onCopy}
          disabled={!prompt}
          className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          {copied ? '복사 완료' : '복사'}
        </button>
      </div>

      <div className="mt-4 flex-1 overflow-hidden rounded-2xl bg-white/5 p-4">
        <pre className="h-full overflow-auto whitespace-pre-wrap break-words text-sm leading-7 text-slate-100">
          {prompt || '좌측에서 템플릿을 선택하고 내용을 입력하면 여기서 결과를 바로 확인할 수 있습니다.'}
        </pre>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-400">
        복사 후 ChatGPT, Gemini, Claude 같은 외부 AI 서비스에 붙여넣기 전에 한 번 더 검수하는 흐름을 전제로 구성했습니다.
      </p>
    </section>
  )
}

export default PromptPreview
