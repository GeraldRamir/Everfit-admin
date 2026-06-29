import Image from "next/image";
import Link from "next/link";

type EverfitLogoProps = {
  className?: string;
  theme?: "wine" | "light";
};

export default function EverfitLogo({ className = "", theme = "wine" }: EverfitLogoProps) {
  const src =
    theme === "light"
      ? "/images/logo-original-transparent.png"
      : "/images/logo-everfit-transparent.png";

  return (
    <Link href="/dashboard" className={`inline-flex items-center gap-2 ${className}`}>
      <Image src={src} alt="Everfit by Mich" width={132} height={36} priority />
    </Link>
  );
}
