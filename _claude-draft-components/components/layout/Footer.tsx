import Link from "next/link";
import { DotAccent } from "../ui/DotAccent";

const COLUMNS = [
  {
    title: "About Us",
    links: ["Our Company", "Our Philosophy", "Leadership", "Milestones", "Locations"],
    base: "/about",
  },
  {
    title: "Our Brands",
    links: ["Household", "Skincare", "Brand Portfolio"],
    base: "/brands",
  },
  {
    title: "Innovation",
    links: ["R&D", "Technology", "Quality Assurance"],
    base: "/innovation",
  },
  {
    title: "Sustainability",
    links: ["Our Approach", "Environment", "Social", "Governance"],
    base: "/sustainability",
  },
  {
    title: "Careers",
    links: ["Why ARIGEO", "Open Positions", "Life at ARIGEO"],
    base: "/careers",
  },
  {
    title: "Contact Us",
    links: ["Get in Touch", "Media Inquiries", "Partners"],
    base: "/contact",
  },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function Footer() {
  return (
    <footer className="bg-[var(--color-footer)] text-white">
      <div className="mx-auto grid max-w-[var(--container-max)] grid-cols-2 gap-x-8 gap-y-10 px-[var(--container-pad)] py-[var(--space-16)] md:grid-cols-4 lg:grid-cols-[1.4fr_repeat(6,1fr)]">
        {/* Brand column */}
        <div className="col-span-2 flex flex-col gap-4 md:col-span-4 lg:col-span-1">
          <span className="flex items-center gap-1 text-2xl font-extrabold tracking-tight">
            ARIGE
            <DotAccent size="lg" className="translate-y-[2px]" />
          </span>
          <p className="max-w-[32ch] text-[var(--text-small)] leading-[var(--leading-normal)] text-white/60">
            Trusted household and skincare products that combine advanced
            innovation with safety and care.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title} className="flex flex-col gap-3">
            <h3 className="text-[var(--text-small)] font-semibold">{col.title}</h3>
            <ul className="flex flex-col gap-2">
              {col.links.map((label) => (
                <li key={label}>
                  <Link
                    href={`${col.base}/${slugify(label)}`}
                    className="text-[var(--text-small)] text-white/60 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[var(--container-max)] flex-col items-center justify-between gap-3 px-[var(--container-pad)] py-5 text-[var(--text-small)] text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} ARIGEO Co., Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="transition-colors hover:text-white">Terms of Use</Link>
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link>
            <Link href="/sitemap" className="transition-colors hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
