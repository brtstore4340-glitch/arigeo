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
        <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-arigeo-gray">
          <DotAccent size="sm" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold leading-snug text-arigeo-black">
        {title}
      </h2>
    </div>
  );
}
