type DotAccentProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = { sm: "size-1.5", md: "size-2.5", lg: "size-4" };

export function DotAccent({ size = "md", className = "" }: DotAccentProps) {
  return (
    <span
      aria-hidden
      className={`inline-block rounded-full bg-[var(--color-brand-red)] ${sizeMap[size]} ${className}`}
    />
  );
}
