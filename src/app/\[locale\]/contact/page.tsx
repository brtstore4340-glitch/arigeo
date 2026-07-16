'use client';

import { useLocale } from 'next-intl';
import { useState } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';

type EnquiryType = 'general' | 'product' | 'partnership' | 'media' | 'career';

const copy = {
  en: {
    title: 'Contact Us',
    description: 'Get in touch with ARIGEO. We\'d love to hear from you.',
    form: {
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      company: 'Company (Optional)',
      enquiryType: 'Enquiry Type',
      message: 'Message',
      consent:
        'I agree to ARIGEO\'s Privacy Policy and consent to being contacted',
      submit: 'Send Enquiry',
      sending: 'Sending...',
      success: 'Thank you! We\'ll be in touch soon.',
      error: 'Something went wrong. Please try again.',
    },
    enquiryTypes: {
      general: 'General Enquiry',
      product: 'Product Information',
      partnership: 'Partnership / Distributor',
      media: 'Media / Press',
      career: 'Career Opportunity',
    },
    officeInfo: {
      title: 'ARIGEO Headquarters',
      address: 'Bangkok, Thailand',
      email: 'contact@arigeo.com',
      phone: '+66 (0) 2 XXXX XXXX',
    },
  },
  th: {
    title: 'ติดต่อเรา',
    description: 'ติดต่อกับ ARIGEO เรายินดีที่จะได้ยินจากคุณ',
    form: {
      name: 'ชื่อเต็ม',
      email: 'อีเมล',
      phone: 'หมายเลขโทรศัพท์',
      company: 'บริษัท (ไม่บังคับ)',
      enquiryType: 'ประเภทการสอบถาม',
      message: 'ข้อความ',
      consent:
        'ฉันยอมรับนโยบายความเป็นส่วนตัวของ ARIGEO และยินยอมให้ติดต่อ',
      submit: 'ส่งคำขอ',
      sending: 'กำลังส่ง...',
      success: 'ขอบคุณ! เราจะติดต่อคุณในเร็วๆ นี้',
      error: 'มีบางอย่างผิดพลาด โปรดลองอีกครั้ง',
    },
    enquiryTypes: {
      general: 'การสอบถามทั่วไป',
      product: 'ข้อมูลผลิตภัณฑ์',
      partnership: 'ความเป็นหุ้นส่วน / ผู้จัดจำหน่าย',
      media: 'สื่อ / สำนักพิมพ์',
      career: 'โอกาสการเลือกปฏิบัติ',
    },
    officeInfo: {
      title: 'สำนักงานใหญ่ ARIGEO',
      address: 'กรุงเทพมหานคร ประเทศไทย',
      email: 'contact@arigeo.com',
      phone: '+66 (0) 2 XXXX XXXX',
    },
  },
};

export default function ContactPage() {
  const locale = useLocale() as 'en' | 'th';
  const [enquiryType, setEnquiryType] = useState<EnquiryType>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [consent, setConsent] = useState(false);

  const t = copy[locale];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          company: formData.get('company'),
          enquiryType,
          message: formData.get('message'),
          locale,
        }),
      });

      if (response.ok) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();
        setEnquiryType('general');
        setConsent(false);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900">
                    {t.form.name}
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900">
                    {t.form.email}
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900">
                    {t.form.phone}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900">
                    {t.form.company}
                  </label>
                  <input
                    type="text"
                    name="company"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>

                {/* Enquiry Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900">
                    {t.form.enquiryType}
                  </label>
                  <select
                    value={enquiryType}
                    onChange={e => setEnquiryType(e.target.value as EnquiryType)}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                  >
                    <option value="general">{t.enquiryTypes.general}</option>
                    <option value="product">{t.enquiryTypes.product}</option>
                    <option value="partnership">{t.enquiryTypes.partnership}</option>
                    <option value="media">{t.enquiryTypes.media}</option>
                    <option value="career">{t.enquiryTypes.career}</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900">
                    {t.form.message}
                  </label>
                  <textarea
                    name="message"
                    rows={6}
                    required
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>

                {/* Consent */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={consent}
                    onChange={e => setConsent(e.target.checked)}
                    required
                    className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-600"
                  />
                  <label className="ml-3 text-sm text-slate-700">
                    {t.form.consent}
                  </label>
                </div>

                {/* Status Messages */}
                {status === 'success' && (
                  <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
                    {t.form.success}
                  </div>
                )}

                {status === 'error' && (
                  <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
                    {t.form.error}
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting || !consent}
                  className="w-full"
                >
                  {isSubmitting ? t.form.sending : t.form.submit}
                </Button>
              </form>
            </div>

            {/* Sidebar: Office Info */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-bold text-slate-900">
                {t.officeInfo.title}
              </h3>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase">
                    Address
                  </p>
                  <p className="mt-1 text-sm text-slate-900">
                    {t.officeInfo.address}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase">
                    Email
                  </p>
                  <a
                    href={`mailto:${t.officeInfo.email}`}
                    className="mt-1 text-sm text-red-600 hover:text-red-700"
                  >
                    {t.officeInfo.email}
                  </a>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase">
                    Phone
                  </p>
                  <a
                    href={`tel:${t.officeInfo.phone}`}
                    className="mt-1 text-sm text-red-600 hover:text-red-700"
                  >
                    {t.officeInfo.phone}
                  </a>
                </div>
              </div>

              {/* Note: Placeholder data - CONTENT REQUIRED */}
              <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                <p className="text-xs text-yellow-800 font-medium">
                  ⚠️ Contact information is placeholder data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
