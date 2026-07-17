import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Captain Maid | Our Story & Mission',
  description:
    'Learn about Captain Maid. Over 20 years of trusted cleaning solutions for Thai families. Powerful, safe, and eco-conscious.',
  openGraph: {
    title: 'About Captain Maid',
    description: 'Our story, mission, and commitment to Thai families',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-captain-cream dark:bg-captain-cream-dark pt-24">
      <div className="container-safe">
        {/* Hero Section */}
        <div className="mb-2xl py-xl text-center">
          <h1 className="text-5xl font-serif font-bold mb-md text-captain-blue">About Captain Maid</h1>
          <p className="text-xl text-captain-neutral max-prose mx-auto">
            Over 20 years of trusted cleaning solutions for Thai families
          </p>
        </div>

        {/* Brand Story */}
        <div className="bg-captain-light rounded-sm p-2xl mb-2xl grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-lg text-captain-text">Our Story</h2>
            <p className="text-lg text-captain-neutral leading-relaxed mb-md">
              Captain Maid was founded on a simple belief: a clean home shouldn't come at the cost of your
              family's health or the environment.
            </p>
            <p className="text-lg text-captain-neutral leading-relaxed mb-md">
              For over 20 years, we've been crafting cleaning solutions specifically designed for Thai homes.
              We understand your climate, your lifestyle, and your needs.
            </p>
            <p className="text-lg text-captain-neutral leading-relaxed">
              Every product in our range is tested with Thai families in mind—powerful enough to handle our
              hot, humid weather, yet gentle enough to keep your family safe.
            </p>
          </div>
          <div className="bg-gradient-to-br from-captain-blue to-captain-yellow rounded-sm aspect-square flex items-center justify-center text-9xl">
            ⚓
          </div>
        </div>

        {/* Mission & Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-2xl">
          <div className="bg-captain-light rounded-sm p-xl">
            <h3 className="text-2xl font-serif font-bold mb-md text-captain-text">Our Mission</h3>
            <p className="text-captain-neutral">
              To provide powerful, safe, and eco-conscious cleaning solutions that help Thai families maintain
              clean, healthy homes without compromise.
            </p>
          </div>

          <div className="bg-captain-light rounded-sm p-xl">
            <h3 className="text-2xl font-serif font-bold mb-md text-captain-text">Our Vision</h3>
            <p className="text-captain-neutral">
              To be the most trusted household cleaning brand in Thailand, known for quality, safety, and our
              commitment to every Thai family.
            </p>
          </div>

          <div className="bg-captain-light rounded-sm p-xl">
            <h3 className="text-2xl font-serif font-bold mb-md text-captain-text">Our Values</h3>
            <p className="text-captain-neutral">
              Quality, family safety, environmental responsibility, and transparency in everything we do.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-2xl">
          <h2 className="text-3xl font-serif font-bold mb-lg text-captain-blue">Our Journey</h2>
          <div className="space-y-lg">
            {[
              { year: 2000, event: 'Captain Maid founded by a team dedicated to safe household cleaning' },
              { year: 2005, event: 'Expanded product line to serve diverse Thai household needs' },
              { year: 2010, event: 'Achieved 1 million customers milestone' },
              { year: 2015, event: 'Shifted to eco-friendly formulations and sustainable packaging' },
              { year: 2020, event: 'Launched e-commerce platform for direct customer access' },
              { year: 2024, event: 'Introduced world-class website and expanded digital presence' },
            ].map((milestone, i) => (
              <div key={i} className="flex gap-lg items-start">
                <div className="flex-shrink-0 w-24 pt-1">
                  <span className="text-2xl font-bold text-captain-blue">{milestone.year}</span>
                </div>
                <div className="flex-grow pb-lg border-l-2 border-captain-light pl-lg">
                  <p className="text-lg text-captain-neutral">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-2xl">
          <h2 className="text-3xl font-serif font-bold mb-lg text-captain-blue">Our Team</h2>
          <p className="text-lg text-captain-neutral mb-lg">
            We're a dedicated team of chemists, cleaning experts, and Thai families who share a passion for
            safe, effective household solutions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-lg">
            {['👨‍🔬 Product Dev', '🏭 Manufacturing', '📦 Quality Control', '❤️ Customer Care'].map((role, i) => (
              <div key={i} className="bg-captain-light rounded-sm p-lg text-center">
                <p className="text-3xl mb-md">{role.split(' ')[0]}</p>
                <p className="font-semibold text-captain-text">{role.split(' ').slice(1).join(' ')}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-captain-light rounded-sm p-2xl mb-2xl">
          <h2 className="text-3xl font-serif font-bold mb-lg text-captain-blue">Certifications & Standards</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
            {[
              { icon: '✓', label: 'Thai Safety Standard' },
              { icon: '🌍', label: 'Eco-Certified' },
              { icon: '🏥', label: 'Dermatologist Tested' },
              { icon: '💚', label: 'Family Safe' },
            ].map((cert, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl mb-md">{cert.icon}</p>
                <p className="font-semibold text-captain-text text-sm">{cert.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center py-2xl border-t border-captain-light">
          <h2 className="text-3xl font-serif font-bold mb-md text-captain-text">Get in Touch</h2>
          <p className="text-lg text-captain-neutral mb-lg">
            Have questions? We'd love to hear from you.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-sm px-lg py-md bg-captain-yellow text-captain-text rounded-sm font-semibold hover:bg-captain-blue hover:text-white transition-all"
          >
            Contact Us →
          </a>
        </div>
      </div>
    </div>
  )
}
