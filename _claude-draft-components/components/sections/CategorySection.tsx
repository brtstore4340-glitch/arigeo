import Image from "next/image";
import { Button } from "../ui/Button";
import { SectionHeading } from "../ui/SectionHeading";

type CategorySectionProps = {
  tone: "household" | "skincare";
  title: string;
  description: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  /** flip = true puts image on the left (alternate sections) */
  flip?: boolean;
};

export function CategorySection({
  tone, title, description, href, imageSrc, imageAlt, flip = false,
}: CategorySectionProps) {
  return (
    <section style={{ backgroundColor: `var(--color-${tone})` }}>
      <div
        className={`mx-auto grid max-w-[var(--container-max)] grid-cols-1 items-center gap-10 px-[var(--container-pad)] py-[var(--space-24)] md:grid-cols-2 ${
          flip ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div className="flex flex-col items-start gap-6">
          <SectionHeading eyebrow={tone} title={title} />
          <p className="max-w-[46ch] text-[var(--text-body)] leading-[var(--leading-normal)] text-[var(--color-ink-soft)]">
            {description}
          </p>
          <Button href={href} variant="secondary">Explore products</Button>
        </div>
        <div className="overflow-hidden rounded-[var(--radius-lg)]">
          <Image src={imageSrc} alt={imageAlt} width={720} height={520} className="h-auto w-full object-cover" />
        </div>
      </div>
    </section>
  );
}
