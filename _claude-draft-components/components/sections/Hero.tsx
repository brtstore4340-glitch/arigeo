import Image from "next/image";
import { Button } from "../ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Red circle — bleeds off top-right edge deliberately */}
      <div
        aria-hidden
        className="absolute -top-[12%] -right-[8%] aspect-square w-[52vw] max-w-[640px] rounded-full bg-[var(--color-brand-red)]
                   max-md:-top-[6%] max-md:-right-[24%] max-md:w-[80vw]"
      />
      <div className="relative mx-auto grid max-w-[var(--container-max)] grid-cols-1 items-center gap-10 px-[var(--container-pad)] py-[var(--space-16)] md:grid-cols-2 md:py-[var(--space-24)]">
        <div className="flex flex-col gap-6">
          <h1 className="text-[length:var(--text-display)] font-bold leading-[var(--leading-tight)] text-[var(--color-ink)]">
            Elevating
            <br />
            Everyday Life
            <span className="mt-2 block text-[length:var(--text-h2)] font-semibold text-[var(--color-brand-red)]">
              Innovation you can feel at home.
            </span>
          </h1>
          <p className="max-w-[42ch] text-[var(--text-body)] leading-[var(--leading-normal)] text-[var(--color-ink-soft)]">
            ARIGEO develops trusted household and skincare products that combine
            advanced innovation with safety and care.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/products">Our Products</Button>
            <Button href="/about" variant="secondary">About ARIGEO</Button>
          </div>
        </div>

        {/* Art direction: separate crops for mobile / desktop */}
        <div className="relative">
          <picture>
            <source media="(max-width: 767px)" srcSet="/images/hero-products-mobile.png" />
            <Image
              src="/images/hero-products-desktop.png"
              alt="ARIGEO household and skincare product lineup"
              width={720}
              height={560}
              priority
              className="relative z-10 h-auto w-full"
            />
          </picture>
        </div>
      </div>
    </section>
  );
}
