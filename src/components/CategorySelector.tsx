import type { PromptCategory } from '../types/prompt'

type CategorySelectorProps = {
  categories: PromptCategory[]
  selectedCategoryId: string
  onSelect: (categoryId: string) => void
}

function CategorySelector({
  categories,
  selectedCategoryId,
  onSelect,
}: CategorySelectorProps) {
  return (
    <section className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-slate-900">카테고리 선택</p>
        <p className="mt-1 text-sm text-slate-500">
          작업 목적에 맞는 분야를 먼저 골라주세요.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => {
          const isActive = category.id === selectedCategoryId

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              className={[
                'rounded-2xl border px-4 py-3 text-left transition',
                isActive
                  ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
              ].join(' ')}
            >
              <p className="text-sm font-semibold">{category.name}</p>
              <p
                className={[
                  'mt-1 text-xs leading-5',
                  isActive ? 'text-slate-200' : 'text-slate-500',
                ].join(' ')}
              >
                {category.description}
              </p>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default CategorySelector
