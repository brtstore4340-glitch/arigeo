'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';

const copy = {
  en: {
    title: 'Join the ARIGEO Team',
    description: 'We\'re building the future of household and skincare innovation. Join us and make an impact.',
    aboutArigeo: 'Why Join ARIGEO?',
    aboutText:
      'At ARIGEO, we believe in creating products that improve everyday life with integrity, innovation, and care. We\'re committed to sustainability, diversity, and empowering our people to make a difference.',
    culture: 'Our Culture',
    culturePoints: [
      'Innovation-first mindset',
      'Collaborative environment',
      'Commitment to quality',
      'Growth opportunities',
      'Sustainable practices',
    ],
    positions: 'Open Positions',
    apply: 'Apply Now',
    contactHR: 'Contact HR',
    contentRequired: 'Content Required',
    noPositions: 'Currently accepting applications for.',
  },
  th: {
    title: 'เข้าร่วมทีม ARIGEO',
    description: 'เรากำลังสร้างอนาคตของนวัตกรรมบ้านและผิวหนัง เข้าร่วมเราและสร้างผลกระทบ',
    aboutArigeo: 'ทำไมต้องเข้าร่วม ARIGEO?',
    aboutText:
      'ที่ ARIGEO เราเชื่อในการสร้างผลิตภัณฑ์ที่ปรับปรุงชีวิตประจำวันด้วยความสมบูรณ์ นวัตกรรม และการดูแล เรามุ่งมั่นในความยั่งยืน ความหลากหลาย และการสร้างอำนาจให้คนของเราสร้างความแตกต่าง',
    culture: 'วัฒนธรรมของเรา',
    culturePoints: [
      'นวัตกรรมเป็นอันดับแรก',
      'สภาพแวดล้อมการทำงานแบบร่วมมือ',
      'ความมุ่งมั่นต่อคุณภาพ',
      'โอกาสการเติบโต',
      'แนวปฏิบัติที่ยั่งยืน',
    ],
    positions: 'ตำแหน่งที่เปิด',
    apply: 'สมัครตอนนี้',
    contactHR: 'ติดต่อ HR',
    contentRequired: 'ต้องการเนื้อหา',
    noPositions: 'ยอมรับใบสมัครสำหรับ',
  },
};

export default function CareersPage() {
  const locale = useLocale() as 'en' | 'th';
  const t = copy[locale];

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

      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* Why Join Section */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              {t.aboutArigeo}
            </h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              {t.aboutText}
            </p>
          </section>

          {/* Culture Section */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              {t.culture}
            </h2>
            <ul className="mt-4 space-y-3">
              {t.culturePoints.map((point, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-3 mt-1 inline-block h-2 w-2 rounded-full bg-red-600" />
                  <span className="text-base text-slate-700">{point}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Open Positions */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              {t.positions}
            </h2>

            <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-6">
              <p className="text-sm text-yellow-800 font-medium">
                ⚠️ {t.contentRequired}
              </p>
              <p className="mt-2 text-sm text-yellow-700">
                {t.noPositions} ARIGEO. Check back soon for updates or contact our HR team.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href={`/${locale}/contact`}>
                <Button variant="primary">
                  {t.contactHR}
                </Button>
              </Link>
            </div>
          </section>

          {/* Application Info */}
          <section className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Application Process
            </h3>
            <p className="mt-3 text-sm text-slate-700">
              Interested in joining ARIGEO? Send your resume and cover letter to{' '}
              <a
                href="mailto:careers@arigeo.com"
                className="font-medium text-red-600 hover:text-red-700"
              >
                careers@arigeo.com
              </a>
              . We review all applications and will be in touch with qualified candidates.
            </p>
            <p className="mt-3 text-xs text-slate-600">
              Note: Email address is placeholder. Update before production.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
