import { PillarPage } from "@/components/PillarPage";

export const metadata = {
  title: "Innovation | ARIGEO COMPANY LIMITED",
  description:
    "Innovation that understands people — R&D, ingredients, technology, standards and quality assurance at ARIGEO.",
  keywords: "ARIGEO, innovation, R&D, ingredients, technology, standards, quality assurance"
};

const pillars = ["rnd", "ingredients", "technology", "standards", "quality"] as const;

export default function InnovationPage() {
  return <PillarPage namespace="Innovation" pillarKeys={pillars} />;
}
