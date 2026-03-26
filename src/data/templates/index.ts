import type { PromptTemplate } from '../../types/prompt'
import { audioTemplates } from './audio'
import { blogTemplates } from './blog'
import { developmentTemplates } from './development'
import { videoTemplates } from './video'

export const templates: PromptTemplate[] = [
  ...developmentTemplates,
  ...blogTemplates,
  ...videoTemplates,
  ...audioTemplates,
]
