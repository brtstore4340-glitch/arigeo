'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { SectionHeading } from '@/components/ui/SectionHeading';

const copy = {
  en: {
    title: 'Newsroom',
    description: 'Latest news, press releases, and stories from ARIGEO',
    readMore: 'Read Article',
    published: 'Published',
    contentRequired: 'Content Required',
  },
  th: {
    title: 'ห้องข่าว',
    description: 'ข่าวล่าสุด แถลงการณ์สื่อ และเรื่องราวจาก ARIGEO',
    readMore: 'อ่านบทความ',
    published: 'เผยแพร่',
    contentRequired: 'ต้องการเนื้อหา',
  },
};

// Placeholder articles - CONTENT REQUIRED
const articles = [
  {
    slug: 'arigeo-launches-innovation-initiative',
    titleEn: 'ARIGEO Launches Innovation Initiative',
    titleTh: 'ARIGEO เปิดตัวโครงการนวัตกรรม',
    excerptEn: 'ARIGEO announces new R&D partnerships to drive innovation in household and skincare solutions.',
    excerptTh: 'ARIGEO ประกาศความเป็นหุ้นส่วน R&D ใหม่เพื่อขับเคลื่อนนวัตกรรม',
    publishedDate: '2026-07-15',
    category: 'News',
    imageUrl: null,
  },
  {
    slug: 'sustainability-milestone',
    titleEn: 'ARIGEO Reaches Sustainability Milestone',
    titleTh: 'ARIGEO บรรลุเป้าหมายความยั่งยืน',
    excerptEn: 'Corporate responsibility progress report published.',
    excerptTh: 'รายงานความคืบหน้าในด้านความรับผิดชอบต่อสังคมขององค์กร',
    publishedDate: '2026-07-10',
    category: 'Sustainability',
    imageUrl: null,
  },
  {
    slug: 'captain-maid-expansion',
    titleEn: 'Captain Maid Expands Regional Presence',
    titleTh: 'Captain Maid ขยายการปรากฏตัวในภูมิภาค',
    excerptEn: 'Leading household cleaning brand announces distribution in new markets.',
    excerptTh: 'ยี่ห้อทำความสะอาดบ้านชั้นนำประกาศการจัดจำหน่ายในตลาดใหม่',
    publishedDate: '2026-07-01',
    category: 'Business',
    imageUrl: null,
  },
];

export default function NewsroomPage() {
  const locale = useLocale() as 'en' | 'th';
  const t = copy[locale];

  const isEnglish = locale === 'en';

  return (
    <div className="w-full bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <SectionHeading title={t.title} />
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            {t.description}
          </p>
        </div>
      </div>

      {/* Articles List */}
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-8">
            {articles.map((article, idx) => (
              <article
                key={idx}
                className="border-b border-slate-200 pb-8 last:border-0"
              >
                <div className="grid gap-6 md:grid-cols-3">
                  {/* Image Placeholder */}
                  <div className="relative h-48 w-full overflow-hidden rounded-lg bg-slate-100 md:col-span-1">
                    {article.imageUrl ? (
                      <img
                        src={article.imageUrl}
                        alt={isEnglish ? article.titleEn : article.titleTh}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-xs text-slate-400 text-center px-4">
                          {t.contentRequired}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="md:col-span-2">
                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">
                      {article.category}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-slate-900 hover:text-red-600 transition">
                      <Link href={`/${locale}/newsroom/${article.slug}`}>
                        {isEnglish ? article.titleEn : article.titleTh}
                      </Link>
                    </h2>

                    <p className="mt-2 text-base text-slate-600">
                      {isEnglish ? article.excerptEn : article.excerptTh}
                    </p>

                    <p className="mt-4 text-sm text-slate-500">
                      <span className="font-semibold">{t.published}:</span>{' '}
                      {new Date(article.publishedDate).toLocaleDateString(
                        locale === 'en' ? 'en-US' : 'th-TH',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </p>

                    <Link
                      href={`/${locale}/newsroom/${article.slug}`}
                      className="mt-4 inline-flex items-center text-red-600 font-semibold hover:text-red-700"
                    >
                      {t.readMore} →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Empty State Note */}
          <div className="mt-12 rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center">
            <p className="text-sm text-yellow-800 font-medium">
              ⚠️ {t.contentRequired}
            </p>
            <p className="mt-2 text-sm text-yellow-700">
              Newsroom articles are placeholder content. Real press releases will be added before production launch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
