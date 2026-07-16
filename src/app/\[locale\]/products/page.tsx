'use client';

import { useLocale } from 'next-intl';
import { useState } from 'react';
import { products, Product } from '@/data/products';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';

type ProductBrand = 'captain-maid' | 'genuleaf' | 'ceratory';
type ProductCategory = string;

export default function ProductsPage() {
  const locale = useLocale() as 'en' | 'th';
  const [selectedBrand, setSelectedBrand] = useState<ProductBrand | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);

  const filtered = products.filter(p => {
    if (selectedBrand && p.brand !== selectedBrand) return false;
    if (selectedCategory && p.category !== selectedCategory) return false;
    return true;
  });

  const copy = {
    en: {
      title: 'Our Products',
      description: 'Explore our complete range of household and skincare solutions',
      filterByBrand: 'Brand',
      filterByCategory: 'Category',
      clearFilters: 'Clear Filters',
      noResults: 'No products match your filters',
      viewProduct: 'View Details',
      contentRequired: 'Content Required',
    },
    th: {
      title: 'ผลิตภัณฑ์ของเรา',
      description: 'สำรวจผลิตภัณฑ์ทั้งหมดของเราเพื่อห้องเรือนและผิวหนัง',
      filterByBrand: 'ยี่ห้อ',
      filterByCategory: 'หมวดหมู่',
      clearFilters: 'ล้างตัวกรอง',
      noResults: 'ไม่มีผลิตภัณฑ์ที่ตรงกับตัวกรองของคุณ',
      viewProduct: 'ดูรายละเอียด',
      contentRequired: 'ต้องการเนื้อหา',
    },
  };

  const t = copy[locale];
  const brands: ProductBrand[] = ['captain-maid', 'genuleaf', 'ceratory'];
  const categories = Array.from(
    new Set(products.map(p => p.category))
  );

  return (
    <div className="w-full bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <SectionHeading level="h1" locale={locale}>
            {t.title}
          </SectionHeading>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            {t.description}
          </p>
        </div>
      </div>

      {/* Filters and Product Grid */}
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Filter Controls */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-wrap gap-4">
              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  {t.filterByBrand}
                </label>
                <div className="flex flex-wrap gap-2">
                  {brands.map(brand => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        selectedBrand === brand
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      {brand === 'captain-maid' ? 'Captain Maid' : brand === 'genuleaf' ? 'GenuLeaf' : 'CeraTory'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  {t.filterByCategory}
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        selectedCategory === cat
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear Filters Button */}
            {(selectedBrand || selectedCategory) && (
              <button
                onClick={() => {
                  setSelectedBrand(null);
                  setSelectedCategory(null);
                }}
                className="text-sm font-medium text-red-600 hover:text-red-700 underline"
              >
                {t.clearFilters}
              </button>
            )}
          </div>

          {/* Product Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(product => (
                <div
                  key={product.slug}
                  className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.imageAlt || product.slug}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-sm text-slate-400">
                          {t.contentRequired}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">
                      {product.brand === 'captain-maid'
                        ? 'Captain Maid'
                        : product.brand === 'genuleaf'
                        ? 'GenuLeaf'
                        : 'CeraTory'}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">
                      {product.name || product.slug}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {product.shortBenefit || '–'}
                    </p>

                    {/* Price */}
                    {product.price !== null && (
                      <p className="mt-3 text-lg font-bold text-slate-900">
                        {product.price > 0 ? `${product.currency || 'THB'} ${product.price}` : 'Price TBD'}
                      </p>
                    )}

                    {/* Size */}
                    {product.sizes?.[0] && (
                      <p className="mt-1 text-sm text-slate-500">
                        {product.sizes[0].label}
                      </p>
                    )}

                    {/* CTA */}
                    <Link href={`/${locale}/products/${product.slug}`}>
                      <Button variant="primary" className="mt-4 w-full">
                        {t.viewProduct}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-lg text-slate-600">{t.noResults}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
