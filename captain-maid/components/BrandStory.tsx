export function BrandStory() {
  return (
    <section id="about" className="section-spacing">
      <div className="container-safe">
        <div className="bg-captain-light rounded-sm p-2xl md:p-xl text-center">
          {/* Emoji Icon */}
          <div className="text-6xl mb-lg">💚</div>

          {/* Heading */}
          <h2 className="text-4xl font-serif font-bold mb-lg text-captain-blue">Why Captain Maid?</h2>

          {/* Story Text */}
          <div className="max-w-2xl mx-auto space-y-lg text-lg leading-relaxed text-captain-neutral">
            <p>
              We started because we believe a clean home shouldn't come at the cost of your family's
              health or the environment. For over 20 years, Captain Maid has been trusted by Thai
              households.
            </p>

            <p>
              Every product is formulated with our climate in mind—our hot, humid weather has unique
              cleaning challenges. We understand them because we live them. Our cleaning solutions are
              powerful yet gentle, effective yet responsible.
            </p>

            <p>
              Whether you're a busy parent, a meticulous homekeeper, or someone who just wants their
              home to feel fresh, Captain Maid is built for Thai families, by people who care about
              your home.
            </p>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-3 gap-lg mt-2xl pt-2xl border-t border-captain-neutral/20">
            <div>
              <div className="text-3xl font-bold text-captain-blue">20+</div>
              <p className="text-sm text-captain-neutral mt-sm">Years of Trust</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-captain-blue">1M+</div>
              <p className="text-sm text-captain-neutral mt-sm">Happy Families</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-captain-blue">100%</div>
              <p className="text-sm text-captain-neutral mt-sm">Family-Safe</p>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Captain Maid',
            description:
              'Trusted cleaning solutions for Thai families. Safe, effective, and kind to your home.',
            foundingDate: '2000',
            areaServed: 'TH',
            founder: {
              '@type': 'Person',
              name: 'Captain Maid Team',
            },
          }),
        }}
      />
    </section>
  )
}
