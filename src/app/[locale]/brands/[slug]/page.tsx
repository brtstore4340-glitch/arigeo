import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { DotAccent } from "@/components/ui/DotAccent";
import { Button } from "@/components/ui/Button";
import { getBrand, type Brand } from "@/data/brands";

type Params = Promise<{ locale: string; slug: string }>;

// NOTE: no generateStaticParams here — next-intl 3.15 server components opt
// into dynamic rendering, and mixing that with SSG causes DYNAMIC_SERVER_USAGE
// at runtime (see ψ retrospective 2026-07-07). All locale routes are dynamic.

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const brand = getBrand(slug);
  if (!brand) return {};

  const t = await getTranslations({ locale, namespace: "Brands" });
  return {
    title: `${t(`${brand.messagesKey}.name`)} | ARIGEO COMPANY LIMITED`,
    description: t(`${brand.messagesKey}.positioning`)
  };
}

function BrandDetail({ brand }: { brand: Brand }) {
  const t = useTranslations("Brands");
  const categoryIndexes = Array.from({ length: brand.categoryCount }, (_, i) => i);

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Header */}
      <section className="bg-arigeo-surface pt-32 pb-16 border-b border-gray-100">
        <div className="shell">
          <nav aria-label="Breadcrumb" className="mb-6 flex gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-arigeo-red transition-colors">Home</Link>
            <span>/</span>
            <Link href="/brands" className="hover:text-arigeo-red transition-colors">{t("title")}</Link>
            <span>/</span>
            <span className="text-arigeo-black font-medium">{t(`${brand.messagesKey}.name`)}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-arigeo-black flex items-center gap-1 m-0">
                {t(`${brand.messagesKey}.name`)}
                <DotAccent size="md" className="translate-y-[4px]" />
              </h1>
              <p className="mt-4 max-w-xl text-lg text-arigeo-gray leading-relaxed">
                {t(`${brand.messagesKey}.positioning`)}
              </p>
              <div className="mt-8">
                <Button href="/products" variant="primary">
                  {t("viewProducts")}
                </Button>
              </div>
            </div>

            <div className="relative h-64 sm:h-72 lg:h-96 rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
              {brand.image ? (
                <Image
                  src={brand.image}
                  alt={t(`${brand.messagesKey}.name`)}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="h-full flex items-center justify-center gap-1" aria-hidden>
                  <span className="text-5xl font-bold tracking-tight text-arigeo-black">
                    {t(`${brand.messagesKey}.name`)}
                  </span>
                  <DotAccent size="lg" className="translate-y-[8px]" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Brand story */}
      <section className="section shell">
        <div className="max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-arigeo-black flex items-center gap-2 mb-6">
            <DotAccent size="sm" />
            {t("storyTitle")}
          </h2>
          <div className="accent-line !m-0 mb-6" />
          <p className="text-lg text-arigeo-gray leading-relaxed">
            {t(`${brand.messagesKey}.story`)}
          </p>
        </div>
      </section>

      {/* Product categories */}
      <section className="bg-arigeo-surface py-20 border-y border-gray-100">
        <div className="shell">
          <h2 className="text-2xl md:text-3xl font-bold text-arigeo-black flex items-center gap-2 mb-10">
            <DotAccent size="sm" />
            {t(`${brand.messagesKey}.categoriesTitle`)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryIndexes.map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm flex items-start gap-4"
              >
                <span className="w-9 h-9 shrink-0 rounded-full bg-arigeo-redtint text-arigeo-red font-bold text-sm flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="m-0 text-base font-medium text-arigeo-black leading-relaxed">
                  {t(`${brand.messagesKey}.categories.${i}`)}
                </p>
              </div>
            ))}
          </div>

          {/* Factual content gate for placeholder product data */}
          {brand.placeholderData && (
            <div className="mt-10 border border-yellow-200/80 rounded-2xl bg-yellow-50/40 p-6 flex items-start gap-3">
              <span className="w-2.5 h-2.5 mt-2 shrink-0 rounded-full bg-yellow-500" aria-hidden />
              <p className="m-0 text-sm text-amber-800 leading-relaxed font-medium">
                {t("brandFactualWarning")}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section shell flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <h2 className="text-2xl font-bold text-arigeo-black m-0">
          {t(`${brand.messagesKey}.name`)}
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button href="/products" variant="primary">{t("viewProducts")}</Button>
          <Button href="/brands" variant="secondary">{t("title")}</Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default async function BrandPage({ params }: { params: Params }) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  return <BrandDetail brand={brand} />;
}
