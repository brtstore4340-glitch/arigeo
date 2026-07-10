'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../primitives';
import { ArticleCard } from './ArticleCard';

interface Article {
  id: string;
  image: string;
  category: string;
  title: string;
  excerpt: string;
  readMoreHref?: string;
}

interface InsightsGridProps {
  featuredArticle: Article;
  articles: Article[];
  categories: string[];
  onFilterChange?: (category: string) => void;
}

/**
 * InsightsGrid Component
 * Featured article + grid of articles with category filters
 * Features: featured image layout, category filter pills, responsive
 */
export const InsightsGrid: React.FC<InsightsGridProps> = ({
  featuredArticle,
  articles,
  categories,
  onFilterChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredArticles = selectedCategory
    ? articles.filter((a) => a.category === selectedCategory)
    : articles;

  const handleFilterChange = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
    onFilterChange?.(category);
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {/* Featured Article */}
      <div className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-96 lg:h-auto rounded-lg overflow-hidden">
          <img
            src={featuredArticle.image}
            alt={featuredArticle.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <Badge text={featuredArticle.category} variant="primary" className="mb-4 w-fit" />
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: 'var(--color-burgundy)' }}
          >
            {featuredArticle.title}
          </h2>
          <p
            className="text-lg text-gray-600 mb-6"
            style={{ color: 'var(--color-text)' }}
          >
            {featuredArticle.excerpt}
          </p>
          <a
            href={featuredArticle.readMoreHref || '#'}
            className="inline-block font-semibold hover:underline w-fit"
            style={{ color: 'var(--color-burgundy)' }}
          >
            Read Full Article →
          </a>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => handleFilterChange('')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            !selectedCategory
              ? 'bg-burgundy text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          style={
            !selectedCategory
              ? { backgroundColor: 'var(--color-burgundy)', color: 'white' }
              : {}
          }
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleFilterChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedCategory === category
                ? 'bg-burgundy text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            style={
              selectedCategory === category
                ? { backgroundColor: 'var(--color-burgundy)', color: 'white' }
                : {}
            }
          >
            {category}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {filteredArticles.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <ArticleCard {...article} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

InsightsGrid.displayName = 'InsightsGrid';
