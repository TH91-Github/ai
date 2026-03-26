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
  const selectedCategory =
    categories.find((category) => category.id === selectedCategoryId) ?? categories[0]

  return (
    <section className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-slate-900">카테고리 선택</p>
        <p className="mt-1 text-sm text-slate-500">
          작업 목적에 맞는 분야를 먼저 골라주세요.
        </p>
      </div>

      <div className="space-y-2">
        <select
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          value={selectedCategoryId}
          onChange={(event) => onSelect(event.target.value)}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
          <p className="text-sm font-medium text-slate-800">{selectedCategory.name}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {selectedCategory.description}
          </p>
        </div>
      </div>
    </section>
  )
}

export default CategorySelector
