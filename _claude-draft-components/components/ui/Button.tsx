import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href?: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
  onClick?: () => void;
  className?: string;
};

const base =
  "inline-flex items-center gap-2 rounded-full px-7 py-3 text-[var(--text-body)] font-semibold " +
  "transition-colors duration-[var(--duration-base)] " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-red)]";

const variants = {
  primary:
    "bg-[var(--color-brand-red)] text-white hover:bg-[var(--color-brand-red-hover)]",
  secondary:
    "border border-[var(--color-ink)] text-[var(--color-ink)] hover:border-[var(--color-brand-red)] hover:text-[var(--color-brand-red)]",
};

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Button({ href, variant = "primary", children, onClick, className = "" }: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
        <Arrow />
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
      <Arrow />
    </button>
  );
}
