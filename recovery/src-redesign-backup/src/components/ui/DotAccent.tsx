type DotAccentProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = { sm: "w-1.5 h-1.5", md: "w-2.5 h-2.5", lg: "w-4 h-4" };

export function DotAccent({ size = "md", className = "" }: DotAccentProps) {
  return (
    <span
      aria-hidden
      className={`inline-block rounded-full bg-arigeo-red ${sizeMap[size]} ${className}`}
    />
  );
}
