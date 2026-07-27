type TagProps = {
  children: string;
  tone?: "default" | "brand";
};

export function Tag({ children, tone = "default" }: TagProps) {
  const styles =
    tone === "brand"
      ? "bg-[var(--color-brand-red-tint)] text-[var(--color-brand-red)]"
      : "border border-[var(--color-line)] text-[var(--color-ink-soft)] bg-white";
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-[var(--text-small)] font-medium ${styles}`}>
      {children}
    </span>
  );
}
