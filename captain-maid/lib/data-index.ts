// Central export for all data
export { products, getAllProducts, getProduct, getProductsByCategory, getRelatedProducts } from './products'
export { blogPosts, getAllBlogPosts, getBlogPost, getFeaturedBlogPost, getBlogPostsByCategory, getRelatedBlogPosts } from './blog'

// Re-export types
export type { Product } from './products'
export type { BlogPost } from './blog'

// Data indices for navigation
export const productCategories = [
  { id: 'all', label: 'All Products' },
  { id: 'floor', label: 'Floor Care' },
  { id: 'kitchen-bath', label: 'Kitchen & Bath' },
  { id: 'specialty', label: 'Specialty Care' },
]

export const blogCategories = [
  'All Articles',
  'Eco-Friendly',
  'Family Care',
  'Deep Clean',
  'Floor Care',
  'Bathroom',
  'Sustainability',
]

export const siteMeta = {
  company: 'Captain Maid',
  tagline: 'Clean Homes, Happy Lives',
  description:
    'Trusted cleaning solutions for Thai families. Safe, effective, and kind to your home.',
  year: new Date().getFullYear(),
}
