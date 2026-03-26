import type { PromptTemplate } from '../types/prompt'

type TemplateSelectorProps = {
  templates: PromptTemplate[]
  selectedTemplateId: string
  onSelect: (templateId: string) => void
}

function TemplateSelector({
  templates,
  selectedTemplateId,
  onSelect,
}: TemplateSelectorProps) {
  return (
    <section className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-slate-900">템플릿 선택</p>
        <p className="mt-1 text-sm text-slate-500">
          카테고리에 맞는 초안 구조를 고르면 입력 항목이 바뀝니다.
        </p>
      </div>

      <div className="space-y-3">
        {templates.map((template) => {
          const isActive = template.id === selectedTemplateId

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template.id)}
              className={[
                'w-full rounded-2xl border px-4 py-4 text-left transition',
                isActive
                  ? 'border-amber-400 bg-amber-50'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
              ].join(' ')}
            >
              <p className="text-sm font-semibold text-slate-900">{template.name}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {template.description}
              </p>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default TemplateSelector
