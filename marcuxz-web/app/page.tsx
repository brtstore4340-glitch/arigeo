import Script from "next/script";
import Hero from "../components/Hero";
import ProblemSection from "../components/ProblemSection";
import TransformationSection from "../components/TransformationSection";
import ServicesSection from "../components/ServicesSection";
import WorkflowSection from "../components/WorkflowSection";
import TechStackSection from "../components/TechStackSection";
import PricingSection from "../components/PricingSection";
import FAQSection from "../components/FAQSection";
import CTASection from "../components/CTASection";
import { localBusinessSchema, webSiteSchema, faqSchema } from "../lib/schema";

export default function Home() {
  return (
    <>
      <Script
        id="schema-local-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <Hero />
      <ProblemSection />
      <TransformationSection />
      <ServicesSection />
      <WorkflowSection />
      <TechStackSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
