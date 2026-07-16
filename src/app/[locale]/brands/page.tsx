import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { DotAccent } from "@/components/ui/DotAccent";
import { Tag } from "@/components/ui/Tag";
import { brands, type Brand } from "@/data/brands";

export const metadata = {
  title: "Our Brands | ARIGEO COMPANY LIMITED",
  description:
    "Discover ARIGEO's premium portfolio of household care and advanced skincare brands developed with science and care.",
  keywords: "ARIGEO, brands, Captain Maid, GenuLeaf, CeraTory, household, skincare"
};

function BrandCard({ brand }: { brand: Brand }) {
  const t = useTranslations("Brands");
  const categoryIndexes = Array.from({ length: brand.categoryCount }, (_, i) => i);

  return (
    <article className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="relative h-56 bg-arigeo-surface">
        {brand.image ? (
          <Image
            src={brand.image}
            alt={t(`${brand.messagesKey}.name`)}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full flex items-center justify-center gap-1" aria-hidden>
            <span className="text-4xl font-bold tracking-tight text-arigeo-black">
              {t(`${brand.messagesKey}.name`)}
            </span>
            <DotAccent size="md" className="translate-y-[6px]" />
          </div>
        )}
      </div>

      <div className="p-8 flex flex-col gap-4 grow">
        <h3 className="text-2xl font-bold text-arigeo-black flex items-center gap-1.5 m-0">
          {t(`${brand.messagesKey}.name`)}
          <DotAccent size="sm" className="translate-y-[2px]" />
        </h3>
        <p className="text-base text-arigeo-gray leading-relaxed m-0">
          {t(`${brand.messagesKey}.positioning`)}
        </p>

        <div className="flex flex-wrap gap-2">
          {categoryIndexes.slice(0, 3).map((i) => (
            <Tag key={i}>{t(`${brand.messagesKey}.categories.${i}`)}</Tag>
          ))}
          {brand.categoryCount > 3 && <Tag tone="brand">+{brand.categoryCount - 3}</Tag>}
        </div>

        <Link
          href={`/brands/${brand.slug}`}
          className="mt-auto inline-flex items-center gap-2 font-semibold text-arigeo-red hover:gap-3 transition-all"
        >
          {t("exploreBrand")}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </article>
  );
}

export default function BrandsPage() {
  const t = useTranslations("Brands");

  const household = brands.filter((b) => b.foundation === "household");
  const skincare = brands.filter((b) => b.foundation === "skincare");

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Header */}
      <section className="bg-arigeo-surface pt-32 pb-16 border-b border-gray-100">
        <div className="shell">
          <nav aria-label="Breadcrumb" className="mb-6 flex gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-arigeo-red transition-colors">Home</Link>
            <span>/</span>
            <span className="text-arigeo-black font-medium">{t("title")}</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-arigeo-black flex items-center gap-1">
            {t("title")}
            <DotAccent size="md" className="translate-y-[4px]" />
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-arigeo-gray leading-relaxed">
            {t("description")}
          </p>
        </div>
      </section>

      {/* Household foundation */}
      <section className="section shell">
        <h2 className="text-2xl md:text-3xl font-bold text-arigeo-black flex items-center gap-2 mb-8">
          <DotAccent size="sm" />
          {t("householdTitle")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {household.map((brand) => (
            <BrandCard key={brand.slug} brand={brand} />
          ))}
        </div>
      </section>

      {/* Skincare foundation */}
      <section className="bg-arigeo-surface py-20 border-y border-gray-100">
        <div className="shell">
          <h2 className="text-2xl md:text-3xl font-bold text-arigeo-black flex items-center gap-2 mb-8">
            <DotAccent size="sm" />
            {t("skincareTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skincare.map((brand) => (
              <BrandCard key={brand.slug} brand={brand} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
