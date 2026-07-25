import React from 'react';

function PlayBadge() {
  return (
    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-current shrink-0">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4l14 8-14 8V4z" /></svg>
    </span>
  );
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type ButtonProps = {
  href?: string;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  showArrow?: boolean;
  className?: string;
};

const base =
  'inline-flex items-center gap-3.5 rounded-full w-fit self-start opacity-80 py-2.5 pr-2.5 pl-8 text-base font-extrabold uppercase tracking-[0.08em] no-underline cursor-pointer border-0 transition-[transform,box-shadow,color,border-color] duration-200 ease-out disabled:opacity-40 disabled:pointer-events-none';

const variantClass: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-gradient-to-b from-arigeo-red to-arigeo-darkred text-arigeo-red-ink shadow-[0_0_0_3px_theme(colors.arigeo.red),0_10px_22px_rgba(227,6,19,0.2)] hover:opacity-100 hover:-translate-y-px hover:shadow-[0_0_0_3px_theme(colors.arigeo.red),0_12px_24px_rgba(227,6,19,0.24)]',
  secondary:
    'bg-transparent text-arigeo-black border border-arigeo-black py-[13px] px-[18px] pl-[18px] hover:opacity-100 hover:border-arigeo-red hover:text-arigeo-red-ink',
};

export default function Button({
  href,
  variant = 'primary',
  children,
  onClick,
  disabled,
  type = 'button',
  showArrow = true,
  className = '',
}: ButtonProps) {
  const icon = variant === 'primary' ? <PlayBadge /> : <Arrow />;
  const content = (
    <>
      {children}
      {showArrow && icon}
    </>
  );
  const classes = `${base} ${variantClass[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {content}
    </button>
  );
}
