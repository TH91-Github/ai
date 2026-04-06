export type BlogPostCategoryId =
  | 'development'
  | 'stock'
  | 'world-news'
  | 'health'
  | 'winter-safety'
  | 'history'
  | 'recipe'

export type BlogPostRecord = {
  id: string
  title: string
  categoryId: BlogPostCategoryId
  url: string
  memo: string
  createdAt: string
}
