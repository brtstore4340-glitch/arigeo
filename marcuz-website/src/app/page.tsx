import Link from 'next/link';
import { getContent } from '@/lib/content';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const content = { hero: {}, trustedRelationships: {}, businessReality: {}, beliefs: {} };

export const metadata = {
  title: 'MARCUZ - Digital Transformation Partner',
  description: 'Transform your business with intelligent systems.',
};

export default function Home() {
  const { hero, trustedRelationships, businessReality, beliefs } = content;

  return (
    <div>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="hero">
          <h1>{hero.headline}</h1>
          <p>{hero.subheading}</p>
          <div className="cta-buttons">
            <Link href="/discovery" className="btn btn-primary">
              {hero.primaryCTA}
            </Link>
            <Link href="/work" className="btn btn-secondary">
              {hero.secondaryCTA}
            </Link>
          </div>
        </section>

        {/* Trusted Relationships */}
        <section className="clients">
          <h2>{trustedRelationships.headline}</h2>
          <div className="client-grid">
            {trustedRelationships.clients.map((client: any) => (
              <div key={client.name} className="client-card">
                <h3>{client.name}</h3>
                <p>{client.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Business Reality */}
        <section className="challenges">
          <h2>{businessReality.headline}</h2>
          <div className="challenge-grid">
            {businessReality.challenges.map((challenge: any, idx: number) => (
              <div key={idx} className="challenge-card">
                <h3>{challenge.title}</h3>
                <p>{challenge.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Beliefs Section */}
        <section className="beliefs">
          <h2>{beliefs.headline}</h2>
          <ul className="beliefs-list">
            {beliefs.beliefs.map((belief: any, idx: number) => (
              <li key={idx}>{belief}</li>
            ))}
          </ul>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Ready to transform?</h2>
          <Link href="/discovery" className="btn btn-primary">
            Book a Discovery Session
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
