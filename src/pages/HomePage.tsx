import { useMemo, useState } from 'react'
import CategorySelector from '../components/CategorySelector'
import PromptForm from '../components/PromptForm'
import PromptPreview from '../components/PromptPreview'
import { categories } from '../data/categories'
import { templates } from '../data/templates'
import { copyToClipboard } from '../lib/clipboard'
import {
  buildPrompt,
  createInitialValues,
  fillEmptyValuesWithDefaults,
  hasRequiredValues,
} from '../lib/prompt'
import type { PromptFormValue, PromptFormValues, PromptTemplate } from '../types/prompt'

const getTemplatesByCategory = (categoryId: string) =>
  templates.filter((template) => template.categoryId === categoryId)

const getTemplateById = (templateId: string) =>
  templates.find((template) => template.id === templateId) ?? null

function HomePage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0].id)
  const [selectedTemplateId, setSelectedTemplateId] = useState(getTemplatesByCategory(categories[0].id)[0]?.id ?? '')
  const [formValues, setFormValues] = useState<PromptFormValues>({})
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [copied, setCopied] = useState(false)

  const selectedTemplate: PromptTemplate | null = useMemo(
    () => getTemplateById(selectedTemplateId),
    [selectedTemplateId],
  )
  const isPromptReady = useMemo(
    () => (selectedTemplate ? hasRequiredValues(selectedTemplate.fields, formValues) : false),
    [formValues, selectedTemplate],
  )

  const handleCategorySelect = (categoryId: string) => {
    const nextTemplates = getTemplatesByCategory(categoryId)
    const nextTemplate = nextTemplates[0] ?? null

    setSelectedCategoryId(categoryId)
    setSelectedTemplateId(nextTemplate?.id ?? '')
    setFormValues(nextTemplate ? createInitialValues(nextTemplate.fields) : {})
    setGeneratedPrompt('')
    setCopied(false)
  }

  const handleValueChange = (fieldId: string, value: PromptFormValue) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [fieldId]: value,
    }))
    setGeneratedPrompt('')
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

  const handleComplete = () => {
    if (!selectedTemplate) {
      return
    }

    const nextValues = fillEmptyValuesWithDefaults(selectedTemplate.fields, formValues)
    setFormValues(nextValues)
    setGeneratedPrompt(buildPrompt(selectedTemplate, nextValues))

    const previewElement = document.getElementById('prompt-preview-panel')
    previewElement?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleReset = () => {
    if (!selectedTemplate) {
      return
    }

    setFormValues(createInitialValues(selectedTemplate.fields))
    setGeneratedPrompt('')
    setCopied(false)
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.12),_transparent_24%),linear-gradient(180deg,_#fffdf8_0%,_#f8fafc_52%,_#f1f5f9_100%)] px-4 py-4 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="mb-4 rounded-[24px] border border-white/80 bg-white/80 p-4 shadow-lg shadow-slate-200/40 backdrop-blur">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-600">
              Prompt Draft Builder
            </p>
            <h1 className="mt-1.5 text-xl font-semibold tracking-tight text-slate-950 md:text-2xl">
              카테고리에 맞는 블로그 프롬프트를 빠르게 만듭니다.
            </h1>
            <p className="mt-1.5 text-sm leading-6 text-slate-600">
              카테고리를 고르면 주제에 맞는 입력 항목으로 폼이 바뀌고, 완료를 누르면 다른 AI에 바로 붙여넣을 수 있는 한국어 프롬프트 초안이 생성됩니다.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-lg shadow-slate-200/40 backdrop-blur">
            <CategorySelector
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelect={handleCategorySelect}
            />

            {selectedTemplate ? (
              <PromptForm
                fields={selectedTemplate.fields}
                values={formValues}
                onChange={handleValueChange}
                onComplete={handleComplete}
                isReady={isPromptReady}
              />
            ) : null}
          </div>

          <div id="prompt-preview-panel">
            <PromptPreview
              categoryName={
                categories.find((category) => category.id === selectedCategoryId)?.name ?? ''
              }
              prompt={generatedPrompt}
              copied={copied}
              onCopy={handleCopy}
              onReset={handleReset}
            />
          </div>
        </section>
      </div>
    </main>
  )
}

export default HomePage
