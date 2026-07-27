import Image from "next/image";
import Link from "next/link";
import { Tag } from "../ui/Tag";

type NewsCardProps = {
  href: string;
  imageSrc: string;
  imageAlt: string;
  category: string;
  date: string;
  title: string;
};

export function NewsCard({ href, imageSrc, imageAlt, category, date, title }: NewsCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-[var(--radius-md)] bg-white shadow-[var(--shadow-card)]
                 transition-shadow duration-[var(--duration-base)] hover:shadow-[var(--shadow-card-hover)]
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-brand-red)]"
    >
      <div className="overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={480}
          height={300}
          className="h-auto w-full object-cover transition-transform duration-[var(--duration-base)] group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <Tag>{category}</Tag>
          <time className="text-[var(--text-small)] text-[var(--color-ink-muted)]">{date}</time>
        </div>
        <h3 className="text-[length:var(--text-h3)] font-semibold leading-[var(--leading-snug)] text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-brand-red)]">
          {title}
        </h3>
      </div>
    </Link>
  );
}
