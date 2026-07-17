import Image from "next/image";

type LogoProps = {
  className?: string;
  priority?: boolean;
};

export default function Logo({ className = "h-10 w-auto", priority = false }: LogoProps) {
  return (
    <Image
      src="/images/logos/arigeo-transparent.png"
      alt="ARIGEO logo"
      width={2172}
      height={724}
      className={`${className} object-contain`}
      priority={priority}
    />
  );
}
