import type { PromptTemplate } from '../../types/prompt'
import { developmentTemplates } from './development'
import { healthTemplates } from './health'
import { historyTemplates } from './history'
import { audioTemplates } from './audio'
import { recipeTemplates } from './recipe'
import { stockTemplates } from './stock'
import { winterSafetyTemplates } from './winterSafety'
import { worldNewsTemplates } from './worldNews'

export const templates: PromptTemplate[] = [
  ...developmentTemplates,
  ...worldNewsTemplates,
  ...stockTemplates,
  ...audioTemplates,
  ...healthTemplates,
  ...recipeTemplates,
  ...historyTemplates,
  ...winterSafetyTemplates,
]
