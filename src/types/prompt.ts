export type PromptFieldType = 'text' | 'textarea' | 'select' | 'tags'

export type PromptFieldOption = {
  label: string
  value: string
}

export type PromptField = {
  id: string
  label: string
  type: PromptFieldType
  placeholder?: string
  helperText?: string
  options?: PromptFieldOption[]
}

export type PromptCategory = {
  id: string
  name: string
  description: string
}

export type PromptTemplate = {
  id: string
  categoryId: string
  name: string
  description: string
  fields: PromptField[]
  resultFormat: string
}

export type PromptFormValue = string | string[]

export type PromptFormValues = Record<string, PromptFormValue>
