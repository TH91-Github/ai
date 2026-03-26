import { useMemo, useState } from 'react'
import CategorySelector from '../components/CategorySelector'
import PromptForm from '../components/PromptForm'
import PromptPreview from '../components/PromptPreview'
import TemplateSelector from '../components/TemplateSelector'
import { categories } from '../data/categories'
import { templates } from '../data/templates'
import { copyToClipboard } from '../lib/clipboard'
import { buildPrompt, createInitialValues } from '../lib/prompt'
import type { PromptFormValue, PromptFormValues, PromptTemplate } from '../types/prompt'

const getTemplatesByCategory = (categoryId: string) =>
  templates.filter((template) => template.categoryId === categoryId)

const getTemplateById = (templateId: string) =>
  templates.find((template) => template.id === templateId) ?? null

function HomePage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0].id)
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    getTemplatesByCategory(categories[0].id)[0]?.id ?? '',
  )
  const [formValues, setFormValues] = useState<PromptFormValues>({})
  const [copied, setCopied] = useState(false)

  const categoryTemplates = useMemo(
    () => getTemplatesByCategory(selectedCategoryId),
    [selectedCategoryId],
  )

  const selectedTemplate: PromptTemplate | null = useMemo(
    () => getTemplateById(selectedTemplateId),
    [selectedTemplateId],
  )

  const generatedPrompt = useMemo(
    () => buildPrompt(selectedTemplate, formValues),
    [formValues, selectedTemplate],
  )

  const handleCategorySelect = (categoryId: string) => {
    const nextTemplates = getTemplatesByCategory(categoryId)
    const nextTemplate = nextTemplates[0] ?? null

    setSelectedCategoryId(categoryId)
    setSelectedTemplateId(nextTemplate?.id ?? '')
    setFormValues(nextTemplate ? createInitialValues(nextTemplate.fields) : {})
    setCopied(false)
  }

  const handleValueChange = (fieldId: string, value: PromptFormValue) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [fieldId]: value,
    }))
    setCopied(false)
  }

  const handleTemplateSelect = (templateId: string) => {
    const nextTemplate = getTemplateById(templateId)

    setSelectedTemplateId(templateId)
    setFormValues(nextTemplate ? createInitialValues(nextTemplate.fields) : {})
    setCopied(false)
  }

  const handleCopy = async () => {
    if (!generatedPrompt) {
      return
    }

    try {
      await copyToClipboard(generatedPrompt)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch (error) {
      console.error('클립보드 복사에 실패했습니다.', error)
      setCopied(false)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_28%),linear-gradient(180deg,_#fffdf7_0%,_#f8fafc_48%,_#eef2ff_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-[32px] border border-white/80 bg-white/75 p-6 shadow-xl shadow-slate-200/50 backdrop-blur md:p-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600">
              Prompt Draft Builder
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              AI에 넣기 전, 먼저 검수 가능한 한글 프롬프트 초안을 만듭니다.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">
              이 앱은 AI 답변을 직접 생성하지 않고, 로컬 템플릿 데이터로 1차 프롬프트를 정리해주는 MVP입니다.
              카테고리와 템플릿을 고른 뒤 입력만 하면 바로 복사 가능한 초안이 생성됩니다.
            </p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
          <div className="space-y-6 rounded-[32px] border border-slate-200 bg-white/85 p-5 shadow-lg shadow-slate-200/50 backdrop-blur md:p-6">
            <CategorySelector
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelect={handleCategorySelect}
            />

            <TemplateSelector
              templates={categoryTemplates}
              selectedTemplateId={selectedTemplateId}
              onSelect={handleTemplateSelect}
            />

            {selectedTemplate ? (
              <PromptForm
                fields={selectedTemplate.fields}
                values={formValues}
                onChange={handleValueChange}
              />
            ) : null}
          </div>

          <div className="min-h-[640px]">
            <PromptPreview
              categoryName={
                categories.find((category) => category.id === selectedCategoryId)?.name ?? ''
              }
              templateName={selectedTemplate?.name ?? '선택된 템플릿 없음'}
              prompt={generatedPrompt}
              copied={copied}
              onCopy={handleCopy}
            />
          </div>
        </section>
      </div>
    </main>
  )
}

export default HomePage
