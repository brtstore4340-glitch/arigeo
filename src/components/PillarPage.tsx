import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { DotAccent } from "@/components/ui/DotAccent";

type PillarPageProps = {
  /** Messages namespace: "Innovation" | "Sustainability" */
  namespace: "Innovation" | "Sustainability";
  pillarKeys: readonly string[];
};

// Shared template for commitment-led corporate pages (Innovation, Sustainability).
// Copy comes exclusively from messages; factual claims stay behind the
// CONTENT REQUIRED gate until corporate verification (TODO.md §0.3).
export function PillarPage({ namespace, pillarKeys }: PillarPageProps) {
  const t = useTranslations(namespace);

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

      {/* Story */}
      <section className="section shell">
        <div className="max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-arigeo-black flex items-center gap-2 mb-6">
            <DotAccent size="sm" />
            {t("storyTitle")}
          </h2>
          <div className="accent-line !m-0 mb-6" />
          <p className="text-lg text-arigeo-gray leading-relaxed">
            {t("storyText")}
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-arigeo-surface py-20 border-y border-gray-100">
        <div className="shell">
          <h2 className="text-2xl md:text-3xl font-bold text-arigeo-black flex items-center gap-2 mb-10">
            <DotAccent size="sm" />
            {t("pillarsTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillarKeys.map((key, i) => (
              <div
                key={key}
                className="bg-white rounded-2xl p-8 border border-gray-200/80 shadow-sm flex flex-col gap-3"
              >
                <span className="w-9 h-9 rounded-full bg-arigeo-redtint text-arigeo-red font-bold text-sm flex items-center justify-center">
                  {i + 1}
                </span>
                <h3 className="text-xl font-bold text-arigeo-black m-0">
                  {t(`pillars.${key}.title`)}
                </h3>
                <p className="m-0 text-base text-arigeo-gray leading-relaxed">
                  {t(`pillars.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>

          {/* Factual content gate */}
          <div className="mt-10 border border-yellow-200/80 rounded-2xl bg-yellow-50/40 p-6 flex items-start gap-3">
            <span className="w-2.5 h-2.5 mt-2 shrink-0 rounded-full bg-yellow-500" aria-hidden />
            <p className="m-0 text-sm text-amber-800 leading-relaxed font-medium">
              {t("factualGate")}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
