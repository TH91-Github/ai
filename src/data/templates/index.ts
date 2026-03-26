import type { PromptTemplate } from '../../types/prompt'
import { audioTemplates } from './audio'
import { blogTemplates } from './blog'
import { developmentTemplates } from './development'
import { historyTemplates } from './history'
import { ideaTemplates } from './ideas'
import { lifeTemplates } from './life'
import { marketTemplates } from './market'
import { newsTemplates } from './news'
import { videoTemplates } from './video'

export const templates: PromptTemplate[] = [
  ...developmentTemplates,
  ...blogTemplates,
  ...historyTemplates,
  ...marketTemplates,
  ...newsTemplates,
  ...lifeTemplates,
  ...ideaTemplates,
  ...videoTemplates,
  ...audioTemplates,
]
