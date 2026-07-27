import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  ratio: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

export default function Media({
  src,
  alt,
  ratio,
  priority = false,
  sizes,
  className = "",
}: Props) {
  const [width, height] = ratio.split("/").map(Number);
  const aspectRatio = width / height;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: `${(1 / aspectRatio) * 100}%`,
      }}
    >
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        className={className}
      />
    </div>
  );
}
