import { Link } from "@/i18n/routing";
import type { ReactNode } from "react";

type ButtonProps = {
  href?: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

const base =
  "inline-flex items-center gap-2 rounded-full px-7 py-3 text-base font-semibold " +
  "transition-colors duration-250 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arigeo-red " +
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

const variants = {
  primary:
    "bg-arigeo-red text-white hover:bg-arigeo-darkred",
  secondary:
    "border border-arigeo-black text-arigeo-black hover:border-arigeo-red hover:text-arigeo-red",
};

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Button({
  href,
  variant = "primary",
  children,
  onClick,
  className = "",
  type = "button",
  disabled,
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={`${cls} ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}>
        {children}
        <Arrow />
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
      <Arrow />
    </button>
  );
}
