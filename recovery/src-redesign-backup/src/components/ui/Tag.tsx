type TagProps = {
  children: React.ReactNode;
  tone?: "default" | "brand";
};

export function Tag({ children, tone = "default" }: TagProps) {
  const styles =
    tone === "brand"
      ? "bg-arigeo-redtint text-arigeo-red"
      : "border border-gray-200 text-arigeo-gray bg-white";
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${styles}`}>
      {children}
    </span>
  );
}
