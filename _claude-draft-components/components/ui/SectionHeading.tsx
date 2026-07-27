import { DotAccent } from "./DotAccent";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, title, align = "left" }: SectionHeadingProps) {
  const alignCls = align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <div className={`flex flex-col gap-2 ${alignCls}`}>
      {eyebrow && (
        <span className="flex items-center gap-2 text-[var(--text-small)] font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">
          <DotAccent size="sm" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-[length:var(--text-h2)] font-bold leading-[var(--leading-snug)] text-[var(--color-ink)]">
        {title}
      </h2>
    </div>
  );
}
