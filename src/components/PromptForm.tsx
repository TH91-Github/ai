import type { PromptField, PromptFormValue, PromptFormValues } from '../types/prompt'

type PromptFormProps = {
  fields: PromptField[]
  values: PromptFormValues
  onChange: (fieldId: string, value: PromptFormValue) => void
  onComplete: () => void
  isReady: boolean
}

function PromptForm({ fields, values, onChange, onComplete, isReady }: PromptFormProps) {
  return (
    <section className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-slate-900">입력 폼</p>
        <p className="mt-1 text-sm text-slate-500">
          값은 실시간으로 우측 초안 프롬프트에 반영됩니다.
        </p>
      </div>

      <div className="space-y-3">
        {fields.map((field) => {
          const value = values[field.id]
          const baseClassName =
            'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400'

          return (
            <label key={field.id} className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-700">{field.label}</span>

              {field.type === 'textarea' ? (
                <textarea
                  rows={4}
                  className={baseClassName}
                  placeholder={field.placeholder}
                  value={typeof value === 'string' ? value : ''}
                  onChange={(event) => onChange(field.id, event.target.value)}
                />
              ) : null}

              {field.type === 'select' ? (
                <select
                  className={baseClassName}
                  value={typeof value === 'string' ? value : ''}
                  onChange={(event) => onChange(field.id, event.target.value)}
                >
                  <option value="">선택해주세요</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : null}

              {field.type === 'text' ? (
                <input
                  type="text"
                  className={baseClassName}
                  placeholder={field.placeholder}
                  value={typeof value === 'string' ? value : ''}
                  onChange={(event) => onChange(field.id, event.target.value)}
                />
              ) : null}

              {field.type === 'tags' ? (
                <input
                  type="text"
                  className={baseClassName}
                  placeholder={field.placeholder}
                  value={typeof value === 'string' ? value : ''}
                  onChange={(event) => onChange(field.id, event.target.value)}
                />
              ) : null}

              <p className="text-xs text-slate-400">
                {field.helperText ??
                  (field.type === 'tags'
                    ? '쉼표로 구분해서 입력하세요.'
                    : '입력한 값으로 템플릿 문장을 조합합니다.')}
              </p>
            </label>
          )
        })}
      </div>

      <div className="sticky bottom-0 pt-2">
        <button
          type="button"
          onClick={onComplete}
          disabled={!isReady}
          className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          완료
        </button>
      </div>
    </section>
  )
}

export default PromptForm
