import type { PromptTemplate } from '../../types/prompt'
import { developmentTemplates } from './development'
import { recipeTemplates } from './recipe'
import { stockTemplates } from './stock'
import { winterSafetyTemplates } from './winterSafety'
import { worldNewsTemplates } from './worldNews'

export const templates: PromptTemplate[] = [
  ...developmentTemplates,
  ...worldNewsTemplates,
  ...stockTemplates,
  ...recipeTemplates,
  ...winterSafetyTemplates,
]
