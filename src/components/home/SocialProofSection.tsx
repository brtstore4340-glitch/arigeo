"use client";

/**
 * SocialProofSection
 * Awards, certifications, and social proof
 *
 * Design System Spec:
 * - 2-3 row grid of awards/certifications
 * - Icon + title + description
 * - Kao-style flat borders
 */

interface ProofItem {
  id: string;
  title: string;
  year: string;
  description: string;
}

const proofItems: ProofItem[] = [
  {
    id: "best-employer",
    title: "Best Places to Work",
    year: "2026",
    description: "Recognized as one of Thailand's best employers by WorkVenture",
  },
  {
    id: "sustainability",
    title: "Carbon Neutral Certified",
    year: "2026",
    description: "Achieved carbon neutrality through sustainable practices",
  },
  {
    id: "innovation",
    title: "Innovation Leader",
    year: "2025",
    description: "Top R&D achievements in health and beauty industry",
  },
  {
    id: "quality",
    title: "ISO 9001 Certified",
    year: "2024",
    description: "Quality management system certified and verified",
  },
  {
    id: "diversity",
    title: "Diversity & Inclusion",
    year: "2026",
    description: "Champion for workplace diversity and equal opportunity",
  },
  {
    id: "customer",
    title: "Customer Choice Award",
    year: "2025",
    description: "Top-rated by customers for product quality and service",
  },
];

export default function SocialProofSection() {
  return (
    <section className="social-proof-section">
      <div className="social-proof-container">
        {/* Section Header */}
        <div className="social-proof-header">
          <h2 className="social-proof-title">Recognition & Awards</h2>
          <p className="social-proof-subtitle">
            Trusted by millions, recognized by industry leaders
          </p>
        </div>

        {/* Stats Row */}
        <div className="social-proof-stats">
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Years of Trust</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Employees Worldwide</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100M+</div>
            <div className="stat-label">Customers Served</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">4.8/5</div>
            <div className="stat-label">Customer Rating</div>
          </div>
        </div>

        {/* Awards Grid */}
        <div className="social-proof-grid">
          {proofItems.map((item) => (
            <div key={item.id} className="proof-card" data-proof-id={item.id}>
              <h3 className="proof-title">{item.title}</h3>
              <div className="proof-year">{item.year}</div>
              <p className="proof-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
