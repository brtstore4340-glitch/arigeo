import Link from "next/link";
import type { ReactNode } from "react";

type ValueItem = {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
};

export function ValuesSection({ items }: { items: ValueItem[] }) {
  return (
    <section className="bg-[var(--color-surface-alt)]">
      <div className="mx-auto grid max-w-[var(--container-max)] grid-cols-1 gap-8 px-[var(--container-pad)] py-[var(--space-24)] md:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="flex flex-col items-start gap-4">
            <span className="text-[var(--color-brand-red)] [&_svg]:size-10 [&_svg]:stroke-[1.8]">
              {item.icon}
            </span>
            <h3 className="text-[length:var(--text-h3)] font-bold text-[var(--color-ink)]">
              {item.title}
            </h3>
            <p className="text-[var(--text-body)] leading-[var(--leading-normal)] text-[var(--color-ink-soft)]">
              {item.description}
            </p>
            <Link
              href={item.href}
              className="mt-auto text-[var(--text-small)] font-semibold text-[var(--color-ink)] underline-offset-4 transition-colors hover:text-[var(--color-brand-red)] hover:underline"
            >
              Learn more →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
