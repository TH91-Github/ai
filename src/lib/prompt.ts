import type { PromptField, PromptFormValue, PromptFormValues, PromptTemplate } from '../types/prompt'

const normalizeValue = (value: PromptFormValue | undefined) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(', ')
  }

  return value?.trim() ?? ''
}

export const createInitialValues = (fields: PromptField[]): PromptFormValues =>
  fields.reduce<PromptFormValues>((accumulator, field) => {
    if (field.type === 'tags') {
      accumulator[field.id] = []
      return accumulator
    }

    if (field.type === 'select') {
      accumulator[field.id] = field.options?.[0]?.value ?? ''
      return accumulator
    }

    accumulator[field.id] = ''
    return accumulator
  }, {})

export const parseTags = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

export const buildPrompt = (
  template: PromptTemplate | null,
  values: PromptFormValues,
) => {
  if (!template) {
    return ''
  }

  return template.resultFormat
    .replace(/\{\{(\w+)\}\}/g, (_, key: string) => normalizeValue(values[key]))
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
