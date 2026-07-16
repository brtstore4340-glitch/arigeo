import { PillarPage } from "@/components/PillarPage";

export const metadata = {
  title: "Sustainability | ARIGEO COMPANY LIMITED",
  description:
    "Care for home, skin and planet — ARIGEO's commitment to the environment, social responsibility and governance.",
  keywords: "ARIGEO, sustainability, responsibility, environment, social, governance"
};

const pillars = ["environment", "social", "governance"] as const;

export default function SustainabilityPage() {
  return <PillarPage namespace="Sustainability" pillarKeys={pillars} />;
}
