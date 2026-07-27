import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroCarousel } from "@/components/sections/HeroCarousel";
import { CategorySection } from "@/components/sections/CategorySection";
import { ValuesSection } from "@/components/sections/ValuesSection";
import { NewsCard } from "@/components/sections/NewsCard";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { SectionHeading } from "@/components/ui/SectionHeading";

function FlaskIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 21s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.6-9.5 9-9.5 9Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const VALUES = [
  { icon: <FlaskIcon />, title: "Innovation for Better Living", description: "We continuously create and improve products that deliver better performance and elevate everyday life.", href: "/innovation" },
  { icon: <GlobeIcon />, title: "Sustainability for the Future", description: "We are committed to reducing our environmental impact and building a better world for future generations.", href: "/sustainability" },
  { icon: <HeartIcon />, title: "Safety & Quality You Can Trust", description: "Every product is developed and tested with high standards to ensure safety, quality and reliability.", href: "/innovation/quality-assurance" },
];

const NEWS = [
  { href: "/news/new-vision", imageSrc: "/images/news-corporate.jpg", imageAlt: "ARIGEO office building", category: "Corporate", date: "May 12, 2024", title: "ARIGEO Unveils New Vision for Innovation-Driven Everyday Living" },
  { href: "/news/skincare-launch", imageSrc: "/images/news-product.jpg", imageAlt: "New skincare bottle", category: "Product", date: "May 08, 2024", title: "New Skincare Line Launched for Sensitive and Healthy Skin" },
  { href: "/news/carbon-neutral-2050", imageSrc: "/images/news-sustainability.jpg", imageAlt: "Globe surrounded by leaves", category: "Sustainability", date: "May 01, 2024", title: "ARIGEO Pledges to Achieve Carbon Neutrality by 2050" },
  { href: "/news/skincare-tips", imageSrc: "/images/news-lifestyle.jpg", imageAlt: "Couple using skincare product together", category: "Lifestyle", date: "Apr 28, 2024", title: "Skincare Tips for Everyday Life You Can Start Today" },
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroCarousel />

        <CategorySection
          tone="household"
          title="Smart solutions for every home"
          description="Clean, safe and comfortable living for everyone."
          href="/products/household"
          imageSrc="/images/cat-household.jpg"
          imageAlt="Bright living room with ARIGEO household products"
        />

        <CategorySection
          tone="skincare"
          flip
          title="Skincare, thoughtfully formulated"
          description="Healthy, beautiful skin every day."
          href="/products/skincare"
          imageSrc="/images/cat-skincare.jpg"
          imageAlt="ARIGEO skincare product lineup"
        />

        <ValuesSection items={VALUES} />

        <section className="mx-auto max-w-[var(--container-max)] px-[var(--container-pad)] py-[var(--space-24)]">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading eyebrow="Newsroom" title="News & Stories" />
            
              href="/news"
              className="hidden shrink-0 text-[var(--text-small)] font-semibold text-[var(--color-brand-red)] hover:underline sm:block"
            >
              View all news →
            </a>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {NEWS.map((item) => (
              <NewsCard key={item.href} {...item} />
            ))}
          </div>
        </section>

        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
