'use client';

import { useLocale } from 'next-intl';
import { getProduct, products } from '@/data/products';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const copy = {
  en: {
    backToProducts: 'Back to Products',
    contentRequired: 'Content Required',
    details: 'Product Details',
    size: 'Size',
    price: 'Price',
    availability: 'Availability',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    unknown: 'Unknown',
    ingredients: 'Ingredients',
    usage: 'Usage Instructions',
    safety: 'Safety Information',
    quality: 'Quality Claims',
    relatedProducts: 'Related Products',
    contact: 'Contact Us',
    learn: 'Learn more about this product',
  },
  th: {
    backToProducts: 'กลับไปที่ผลิตภัณฑ์',
    contentRequired: 'ต้องการเนื้อหา',
    details: 'รายละเอียดผลิตภัณฑ์',
    size: 'ขนาด',
    price: 'ราคา',
    availability: 'ความพร้อมใช้งาน',
    inStock: 'มีในสต็อก',
    outOfStock: 'หมดสต็อก',
    unknown: 'ไม่ทราบ',
    ingredients: 'ส่วนประกอบ',
    usage: 'คำแนะนำการใช้',
    safety: 'ข้อมูลความปลอดภัย',
    quality: 'อ้างสิทธิ์คุณภาพ',
    relatedProducts: 'ผลิตภัณฑ์ที่เกี่ยวข้อง',
    contact: 'ติดต่อเรา',
    learn: 'เรียนรู้เพิ่มเติมเกี่ยวกับผลิตภัณฑ์นี้',
  },
};

interface ProductDetailPageProps {
  params: {
    slug: string;
    locale: 'en' | 'th';
  };
}

export default function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const locale = useLocale() as 'en' | 'th';
  const product = getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = products.filter(
    p => product.relatedProductSlugs?.includes(p.slug)
  );

  const t = copy[locale];
  const brandName =
    product.brand === 'captain-maid'
      ? 'Captain Maid'
      : product.brand === 'genuleaf'
      ? 'GenuLeaf'
      : 'CeraTory';

  return (
    <div className="w-full bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href={`/${locale}/products`}
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← {t.backToProducts}
          </Link>
        </div>
      </div>

      {/* Product Detail */}
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative h-96 w-full overflow-hidden rounded-lg bg-slate-100">
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

              {/* Thumbnails (if available) */}
              <div className="grid grid-cols-4 gap-2">
                {product.image && (
                  <div className="relative h-20 w-full overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      src={product.image}
                      alt={product.imageAlt || product.slug}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">
                {brandName}
              </p>

              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                {product.name || product.slug}
              </h1>

              <p className="mt-2 text-lg text-slate-600">
                {product.shortBenefit || '–'}
              </p>

              {/* Rating (if available) */}
              {product.rating !== null && (
                <div className="mt-4 flex items-center">
                  <span className="text-lg font-semibold text-slate-900">
                    {product.rating}
                  </span>
                  <span className="ml-2 text-sm text-slate-600">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
              )}

              {/* Price & Availability */}
              <div className="mt-6 space-y-3">
                {/* Size */}
                <div>
                  <label className="text-sm font-semibold text-slate-900">
                    {t.size}
                  </label>
                  <div className="mt-2 flex gap-2">
                    {product.sizes.map((size, idx) => (
                      <button
                        key={idx}
                        className={`px-4 py-2 rounded-lg border font-medium text-sm transition ${
                          idx === (product.defaultSizeIndex ?? 0)
                            ? 'border-red-600 bg-red-50 text-red-600'
                            : 'border-slate-200 text-slate-900 hover:border-slate-300'
                        }`}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                {product.price !== null && (
                  <div>
                    <label className="text-sm font-semibold text-slate-900">
                      {t.price}
                    </label>
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {product.price > 0
                        ? `${product.currency || 'THB'} ${product.price}`
                        : 'Price TBD'}
                    </p>
                  </div>
                )}

                {/* Availability */}
                {product.inStock !== null && (
                  <div>
                    <label className="text-sm font-semibold text-slate-900">
                      {t.availability}
                    </label>
                    <p
                      className={`mt-1 text-sm font-medium ${
                        product.inStock
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {product.inStock ? t.inStock : t.outOfStock}
                    </p>
                  </div>
                )}
              </div>

              {/* Content Required Gates */}
              {product.placeholderData && (
                <div className="mt-8 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <p className="text-sm text-yellow-800 font-medium">
                    ⚠️ {t.contentRequired}
                  </p>
                  <p className="mt-2 text-sm text-yellow-700">
                    Full product information awaiting approval. Please contact us for details.
                  </p>
                </div>
              )}

              {/* CTA */}
              <Link href={`/${locale}/contact`}>
                <Button variant="primary" className="mt-8 w-full">
                  {t.contact}
                </Button>
              </Link>

              <Link href={`/${locale}/contact`}>
                <button className="mt-3 w-full rounded-lg border border-slate-200 px-6 py-3 font-medium text-slate-900 hover:bg-slate-50 transition">
                  {t.learn}
                </button>
              </Link>
            </div>
          </div>

          {/* Detailed Information Sections */}
          {!product.placeholderData && (
            <div className="mt-12 space-y-8 border-t border-slate-200 pt-8">
              {/* Usage Instructions */}
              {product.factualGates?.safetyInfo && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {t.usage}
                  </h2>
                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-600">
                      {t.contentRequired}
                    </p>
                  </div>
                </div>
              )}

              {/* Ingredients */}
              {product.factualGates?.ingredients && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {t.ingredients}
                  </h2>
                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-600">
                      {t.contentRequired}
                    </p>
                  </div>
                </div>
              )}

              {/* Safety Info */}
              {product.factualGates?.safetyInfo && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {t.safety}
                  </h2>
                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-600">
                      {t.contentRequired}
                    </p>
                  </div>
                </div>
              )}

              {/* Quality Claims */}
              {product.factualGates?.qualityProofs && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {t.quality}
                  </h2>
                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-600">
                      {t.contentRequired}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 border-t border-slate-200 pt-8">
              <h2 className="text-2xl font-bold text-slate-900">
                {t.relatedProducts}
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProducts.map(related => (
                  <Link
                    key={related.slug}
                    href={`/${locale}/products/${related.slug}`}
                    className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:shadow-lg"
                  >
                    <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                      {related.image && (
                        <Image
                          src={related.image}
                          alt={related.imageAlt || related.slug}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900">
                        {related.name || related.slug}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {related.shortBenefit}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
