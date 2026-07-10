import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Locale } from '@/lib/i18n';

const locales: Locale[] = ['en', 'th'];

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = (locales.includes(params.locale as Locale) ? params.locale : 'en') as Locale;

  return (
    <>
      <Header locale={locale} />
      <main style={{ minHeight: 'calc(100vh - 70px - 200px)' }}>{children}</main>
      <Footer locale={locale} />
    </>
  );
}
