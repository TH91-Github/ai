import type { PromptField, PromptFormValue, PromptFormValues, PromptTemplate } from '../types/prompt'

const normalizeValue = (value: PromptFormValue | undefined) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(', ')
  }

  return value?.trim() ?? ''
}

export const createInitialValues = (fields: PromptField[]): PromptFormValues =>
  fields.reduce<PromptFormValues>((accumulator, field) => {
    if (field.defaultValue !== undefined) {
      accumulator[field.id] = field.defaultValue
      return accumulator
    }

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

const isEmptyValue = (value: PromptFormValue | undefined) => {
  if (Array.isArray(value)) {
    return value.length === 0
  }

  return !value?.trim()
}

const getFallbackValue = (field: PromptField): PromptFormValue => {
  if (field.defaultValue !== undefined) {
    return field.defaultValue
  }

  if (field.type === 'tags') {
    return []
  }

  if (field.type === 'select') {
    return field.options?.[0]?.value ?? ''
  }

  return ''
}

export const fillEmptyValuesWithDefaults = (
  fields: PromptField[],
  values: PromptFormValues,
) =>
  fields.reduce<PromptFormValues>((accumulator, field) => {
    const currentValue = values[field.id]

    accumulator[field.id] = isEmptyValue(currentValue)
      ? getFallbackValue(field)
      : currentValue

    return accumulator
  }, { ...values })

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
