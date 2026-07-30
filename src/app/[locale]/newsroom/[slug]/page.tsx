'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use } from 'react';

// Article database - PLACEHOLDER: Connect to CMS when ready
const articles: Record<
  string,
  {
    titleEn: string;
    titleTh: string;
    contentEn: string;
    contentTh: string;
    publishedDate: string;
    category: string;
    imageUrl?: string;
  }
> = {
  'arigeo-launches-innovation-initiative': {
    titleEn: 'ARIGEO Launches Innovation Initiative',
    titleTh: 'ARIGEO เปิดตัวโครงการนวัตกรรม',
    contentEn:
      'ARIGEO is proud to announce a new strategic initiative focused on advancing innovation in household and skincare solutions. This commitment reflects our dedication to creating products that truly improve daily life while maintaining the highest standards of safety and sustainability.\n\nThrough partnerships with leading research institutions and sustainable ingredient suppliers, we are developing next-generation formulations that combine efficacy, safety, and environmental responsibility.',
    contentTh:
      'ARIGEO ภูมิใจที่ประกาศโครงการกลยุทธ์ใหม่ที่มุ่งเน้นไปที่การพัฒนานวัตกรรมในการแก้ปัญหาบ้านและผิวหนัง ความมุ่งมั่นนี้สะท้อนถึงการอุทิศตนของเราในการสร้างผลิตภัณฑ์ที่ปรับปรุงชีวิตประจำวัน\n\nผ่านการเป็นหุ้นส่วนกับสถาบันวิจัยชั้นนำและผู้จัดหาส่วนประกอบที่ยั่งยืน เรากำลังพัฒนาสูตรสัง ที่รวมประสิทธิภาพและความปลอดภัยและความรับผิดชอบต่อสิ่งแวดล้อม',
    publishedDate: '2026-07-15',
    category: 'News',
  },
  'sustainability-milestone': {
    titleEn: 'ARIGEO Reaches Sustainability Milestone',
    titleTh: 'ARIGEO บรรลุเป้าหมายความยั่งยืน',
    contentEn:
      'This quarter marks an important milestone in our sustainability journey. We are committed to minimizing our environmental impact while maximizing positive social contribution.\n\nOur efforts include sustainable sourcing, reduced packaging waste, and community partnerships that align with our core values of caring for home, skin, and planet.',
    contentTh:
      'ไตรมาสนี้ถือเป็นจุดสำคัญในการเดินทางด้านความยั่งยืนของเรา เรามุ่งมั่นที่จะลดผลกระทบต่อสิ่งแวดล้อมพร้อมกับการเพิ่มส่วนแบ่งด้านสังคมในเชิงบวก\n\nความพยายามของเราประกอบด้วยการจัดหาแบบยั่งยืน การลดขยะบรรจุภัณฑ์ และการเป็นหุ้นส่วนของชุมชน',
    publishedDate: '2026-07-10',
    category: 'Sustainability',
  },
  'captain-maid-expansion': {
    titleEn: 'Captain Maid Expands Regional Presence',
    titleTh: 'Captain Maid ขยายการปรากฏตัวในภูมิภาค',
    contentEn:
      'Captain Maid, ARIGEO\'s flagship household cleaning brand, is expanding its regional presence with distribution agreements in key Southeast Asian markets. This expansion reflects strong consumer demand for trusted, innovative household cleaning solutions.',
    contentTh:
      'Captain Maid ยี่ห้อทำความสะอาดบ้านชั้นนำของ ARIGEO กำลังขยายการปรากฏตัวในภูมิภาคด้วยข้อตกลงการจัดจำหน่ายในตลาดเอเชียตะวันออกเฉียงใต้ที่สำคัญ',
    publishedDate: '2026-07-01',
    category: 'Business',
  },
};

interface NewsArticlePageProps {
  params: Promise<{
    slug: string;
    locale: 'en' | 'th';
  }>;
}

const copy = {
  en: {
    backToNewsroom: 'Back to Newsroom',
    share: 'Share Article',
    published: 'Published',
    category: 'Category',
    readMore: 'Read more',
  },
  th: {
    backToNewsroom: 'กลับไปที่ห้องข่าว',
    share: 'แบ่งปันบทความ',
    published: 'เผยแพร่',
    category: 'หมวดหมู่',
    readMore: 'อ่านเพิ่มเติม',
  },
};

export default function NewsArticlePage({
  params,
}: NewsArticlePageProps) {
  const resolvedParams = use(params);
  const locale = useLocale() as 'en' | 'th';
  const article = articles[resolvedParams.slug];
  const t = copy[locale];

  if (!article) {
    notFound();
  }

  const isEnglish = locale === 'en';
  const title = isEnglish ? article.titleEn : article.titleTh;
  const content = isEnglish ? article.contentEn : article.contentTh;

  return (
    <div className="w-full bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href={`/${locale}/newsroom`}
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← {t.backToNewsroom}
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <span>
              <span className="font-semibold">{t.category}:</span> {article.category}
            </span>
            <span>
              <span className="font-semibold">{t.published}:</span>{' '}
              {new Date(article.publishedDate).toLocaleDateString(
                locale === 'en' ? 'en-US' : 'th-TH',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }
              )}
            </span>
          </div>

          {/* Title */}
          <h1 className="mt-6 text-4xl font-bold text-slate-900 leading-tight">
            {title}
          </h1>

          {/* Featured Image Placeholder */}
          {article.imageUrl && (
            <div className="mt-8 overflow-hidden rounded-lg bg-slate-100 relative h-96">
              <Image
                src={article.imageUrl}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="mt-8 space-y-6 text-base text-slate-700 leading-relaxed">
            {content.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-lg border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm text-slate-700">
              For more information or media inquiries, please{' '}
              <Link
                href={`/${locale}/contact`}
                className="font-semibold text-red-600 hover:text-red-700"
              >
                contact us
              </Link>
              .
            </p>
          </div>

        </div>
      </article>
    </div>
  );
}
