import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { DotAccent } from "@/components/ui/DotAccent";

export const metadata = {
  title: "About Us | ARIGEO COMPANY LIMITED",
  description: "ARIGEO is committed to delivering quality health, science, and household solutions that elevate everyday life.",
  keywords: "ARIGEO, about us, company history, mission, vision, values, Chatuchak"
};

export default function AboutPage() {
  const t = useTranslations("About");

  const valuesKeys = ["A", "R", "I", "G", "E", "O"] as const;
  const principleIndexes = [0, 1, 2, 3] as const;

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Header */}
      <section className="bg-arigeo-surface pt-32 pb-16 border-b border-gray-100">
        <div className="shell">
          {/* Breadcrumbs */}
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

      {/* Our Story & Company Profile */}
      <section className="section shell">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold text-arigeo-black flex items-center gap-2">
              <DotAccent size="sm" />
              {t("storyTitle")}
            </h2>
            <div className="accent-line !m-0" />
            <p className="text-lg text-arigeo-gray leading-relaxed">
              {t("storyText")}
            </p>
            <p className="text-base text-gray-500 leading-relaxed">
              {t("locationsText")}
            </p>
          </div>

          <div className="bg-arigeo-surface rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-arigeo-black mb-6">{t("companyInfoTitle")}</h3>
            <ul className="flex flex-col gap-4 m-0 p-0 list-none text-base text-arigeo-black">
              <li className="pb-4 border-b border-gray-200/60 flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="font-semibold text-gray-500">Company Name</span>
                <span className="text-arigeo-black font-medium">{t("companyName")}</span>
              </li>
              <li className="pb-4 border-b border-gray-200/60 flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="font-semibold text-gray-500">Registration</span>
                <span className="text-arigeo-black font-mono font-medium">{t("registration")}</span>
              </li>
              <li className="pb-4 border-b border-gray-200/60 flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="font-semibold text-gray-500">Registered Capital</span>
                <span className="text-arigeo-black font-medium">{t("capital")}</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="font-semibold text-gray-500">Registered Address</span>
                <span className="text-arigeo-black font-medium leading-relaxed">{t("address")}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-arigeo-surface py-20 border-y border-gray-100">
        <div className="shell grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Vision */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-arigeo-black flex items-center gap-2">
              <DotAccent size="sm" />
              {t("visionTitle")}
            </h2>
            <div className="accent-line !m-0" />
            <p className="text-lg text-arigeo-gray leading-relaxed font-medium">
              “{t("visionText")}”
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-arigeo-black flex items-center gap-2">
              <DotAccent size="sm" />
              {t("missionTitle")}
            </h2>
            <div className="accent-line !m-0" />
            <ol className="flex flex-col gap-4 m-0 p-0 list-decimal pl-5 text-arigeo-gray text-base leading-relaxed">
              {[0, 1, 2, 3, 4].map((index) => (
                <li key={index} className="pl-1">
                  {t(`missionItems.${index}`)}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Core Values (ARIGEO Acronym) */}
      <section className="section shell">
        <div className="text-center max-w-xl mx-auto mb-16 flex flex-col items-center">
          <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-arigeo-gray mb-3">
            <DotAccent size="sm" />
            VALUES
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-arigeo-black">
            {t("valuesTitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {valuesKeys.map((letter) => (
            <div key={letter} className="bg-white border border-gray-200/80 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow flex gap-5 items-start group">
              <span className="w-14 h-14 shrink-0 rounded-xl bg-arigeo-redtint text-arigeo-red font-bold text-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                {letter}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-arigeo-black">
                  {t(`values.${letter}.label`)}
                </h3>
                <p className="text-sm text-arigeo-gray leading-relaxed">
                  {t(`values.${letter}.desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Principles */}
      <section className="bg-arigeo-surface py-20 border-y border-gray-100">
        <div className="shell">
          <div className="text-center max-w-xl mx-auto mb-16 flex flex-col items-center">
            <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-arigeo-gray mb-3">
              <DotAccent size="sm" />
              PRINCIPLES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-arigeo-black">
              {t("principlesTitle")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {principleIndexes.map((index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-arigeo-redtint text-arigeo-red font-bold text-sm flex items-center justify-center">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-bold text-arigeo-black">
                    {t(`principles.${index}.title`)}
                  </h3>
                </div>
                <p className="text-base text-arigeo-gray leading-relaxed pl-11">
                  {t(`principles.${index}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Factual Content Gates (Leadership & Milestones) */}
      <section className="section shell grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leadership */}
        <div className="border border-yellow-200/80 rounded-2xl bg-yellow-50/40 p-8 flex flex-col gap-4">
          <h3 className="text-xl font-bold text-arigeo-black flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            {t("leadershipTitle")}
          </h3>
          <p className="text-sm text-amber-800 leading-relaxed font-medium">
            {t("leadershipPending")}
          </p>
        </div>

        {/* Milestones */}
        <div className="border border-yellow-200/80 rounded-2xl bg-yellow-50/40 p-8 flex flex-col gap-4">
          <h3 className="text-xl font-bold text-arigeo-black flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            {t("milestonesTitle")}
          </h3>
          <p className="text-sm text-amber-800 leading-relaxed font-medium">
            {t("milestonesPending")}
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
