const ArrowIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
    <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
    <path d="M3.5 12h17M12 3c2.4 2.5 3.7 5.6 3.7 9S14.4 18.5 12 21M12 3C9.6 5.5 8.3 8.6 8.3 12s1.3 6.5 3.7 9" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const BrandMark = () => (
  <a className="brand" href="#top" aria-label="ARIGEO home">
    <span>ARIGE</span><i />
  </a>
)

const Bottle = ({ className = '', label, sub, volume, pump = true, clear = false }) => (
  <div className={`bottle ${clear ? 'bottle-clear' : ''} ${className}`}>
    {pump ? (
      <div className="pump">
        <span className="pump-top" />
        <span className="pump-neck" />
      </div>
    ) : (
      <div className="jar-cap" />
    )}
    <div className="bottle-body">
      <div className="mini-brand">ARIGE<i /></div>
      <strong>{label}</strong>
      <small>{sub}</small>
      <em>{volume}</em>
    </div>
  </div>
)

const FeatureIcon = ({ type }) => {
  if (type === 'flask') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M18 6h12M21 6v11L10 36a4 4 0 0 0 3.5 6h21a4 4 0 0 0 3.5-6L27 17V6" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M16 31h16M21 25h6" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (type === 'globe') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M6 24h36M24 6c5 5 8 11 8 18s-3 13-8 18M24 6c-5 5-8 11-8 18s3 13 8 18" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 41S7 31 7 18.5C7 12 11.8 8 17.2 8c3.6 0 6 2 6.8 4 .8-2 3.2-4 6.8-4C36.2 8 41 12 41 18.5 41 31 24 41 24 41Z" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

const categoryCards = [
  {
    title: 'Household',
    copy: 'Smart solutions for a clean, safe and comfortable home for everyone.',
    image: '/images/home/household-living-room.png',
    icon: 'spray',
  },
  {
    title: 'Skincare',
    copy: 'Thoughtfully formulated skincare for healthy, beautiful skin every day.',
    image: '/images/home/skincare-marble.png',
    icon: 'bottle',
  },
]

const features = [
  {
    icon: 'flask',
    title: 'Innovation for Better Living',
    copy: 'We continuously create and improve products that deliver better performance and elevate everyday life.',
  },
  {
    icon: 'globe',
    title: 'Sustainability for the Future',
    copy: 'We are committed to reducing our environmental impact and building a better world for future generations.',
  },
  {
    icon: 'heart',
    title: 'Safety & Quality You Can Trust',
    copy: 'Every product is developed and tested with high standards to ensure safety, quality and reliability.',
  },
]

const news = [
  {
    category: 'Corporate',
    date: 'May 12, 2024',
    title: 'ARIGEO Unveils New Vision for Innovation-Driven Everyday Living',
    image: '/images/home/news-corporate-building.png',
  },
  {
    category: 'Product',
    date: 'May 08, 2024',
    title: 'New Skincare Line Launched for Sensitive and Healthy Skin',
    image: '/images/home/news-product-handwash.png',
  },
  {
    category: 'Sustainability',
    date: 'May 01, 2024',
    title: 'ARIGEO Pledges to Achieve Carbon Neutrality by 2050',
    image: '/images/home/news-sustainability-globe.png',
  },
  {
    category: 'Lifestyle',
    date: 'Apr 28, 2024',
    title: 'Skincare Tips for Everyday Life You Can Start Today',
    image: '/images/home/news-lifestyle-couple.png',
  },
]

const footerColumns = [
  ['About Us', 'Our Company', 'Our Philosophy', 'Leadership', 'Milestones', 'Locations'],
  ['Our Brands', 'Household', 'Skincare', 'Brand Portfolio'],
  ['Innovation', 'R&D', 'Technology', 'Quality Assurance'],
  ['Sustainability', 'Our Approach', 'Environment', 'Social', 'Governance'],
  ['Careers', 'Why ARIGEO', 'Open Positions', 'Life at ARIGEO'],
  ['Contact Us', 'Get in Touch', 'Media Inquiries', 'Partners'],
]

function App() {
  return (
    <div className="page" id="top">
      <header className="site-header">
        <div className="shell header-inner">
          <BrandMark />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {['About Us', 'Our Brands', 'Products', 'Innovation', 'Sustainability', 'Newsroom', 'Careers', 'Contact Us'].map((item) => (
              <a href={`#${item.toLowerCase().replaceAll(' ', '-')}`} key={item}>{item}</a>
            ))}
          </nav>
          <div className="header-actions">
            <button className="ghost-btn language"><GlobeIcon /> Global <span>⌄</span></button>
            <button className="icon-btn" aria-label="Search"><SearchIcon /></button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Trusted household & skincare</p>
              <h1>Elevating<br />Everyday Life<br /><span>Through Innovation<br />People Understand</span></h1>
              <p className="hero-lead">ARIGEO develops trusted household and skincare products that combine advanced innovation with safety and care—bringing quality to everyday life for everyone.</p>
              <a className="primary-btn" href="#brands">Discover More <ArrowIcon /></a>
              <div className="slider-dots" aria-label="Hero slides"><i className="active" /><i /><i /></div>
            </div>

            <div className="hero-art" aria-label="ARIGEO product collection">
              <div className="red-orb" />
              <div className="soft-shadow" />
              <div className="product-stage">
                <Bottle className="spray-bottle" label="SURFACE CLEANER" sub="POWERFUL & GENTLE" volume="500 ml" />
                <Bottle className="clear-bottle" label="HAND WASH" sub="GENTLE CARE" volume="400 ml" clear />
                <Bottle className="lotion-bottle" label="BODY LOTION" sub="DAILY MOISTURE" volume="300 ml" />
                <Bottle className="cream-jar" label="MOISTURE CREAM" sub="50 g" volume="" pump={false} />
              </div>
              <div className="plant">
                <span className="stem stem-a" /><span className="stem stem-b" />
                <i className="leaf l1" /><i className="leaf l2" /><i className="leaf l3" /><i className="leaf l4" /><i className="leaf l5" />
              </div>
              <div className="towels"><span /><span /><span /></div>
            </div>
          </div>
        </section>

        <section className="section shell" id="brands">
          <div className="category-grid">
            {categoryCards.map((card) => (
              <article className="category-card" key={card.title}>
                <div className="category-copy">
                  <h2>{card.title}</h2>
                  <div className="accent-line" />
                  <p>{card.copy}</p>
                  <a href="#products">Explore Products <ArrowIcon size={16} /></a>
                  <div className="round-icon" aria-hidden="true">
                    {card.icon === 'spray' ? '⌁' : '◫'}
                  </div>
                </div>
                <div className="category-image" style={{ backgroundImage: `url(${card.image})` }} />
              </article>
            ))}
          </div>
        </section>

        <section className="section section-tight shell" id="innovation">
          <div className="feature-panel">
            {features.map((item) => (
              <article className="feature-item" key={item.title}>
                <div className="feature-icon"><FeatureIcon type={item.icon} /></div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  <a href="#learn-more" aria-label={`Learn more about ${item.title}`}><ArrowIcon /></a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section shell" id="newsroom">
          <div className="section-heading">
            <h2>News & Stories</h2>
            <a href="#all-news">View All News <ArrowIcon size={16} /></a>
          </div>
          <div className="news-grid">
            {news.map((item) => (
              <article className="news-card" key={item.title}>
                <div className="news-image" style={{ backgroundImage: `url(${item.image})` }} />
                <div className="news-body">
                  <div className="news-meta"><span>{item.category}</span><time>{item.date}</time></div>
                  <h3>{item.title}</h3>
                  <a href="#read-story" aria-label={`Read: ${item.title}`}><ArrowIcon /></a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="shell newsletter-wrap">
          <div className="newsletter">
            <div>
              <h2>Stay Updated with ARIGEO</h2>
              <p>Subscribe to our newsletter for the latest updates on innovation, products and everyday living.</p>
            </div>
            <form onSubmit={(event) => event.preventDefault()}>
              <label className="sr-only" htmlFor="email">Email address</label>
              <input id="email" type="email" placeholder="Your email address" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="shell footer-main">
          <div className="footer-brand">
            <BrandMark />
            <p>ARIGEO develops trusted household and skincare products that combine advanced innovation with safety and care—bringing quality to everyday life for everyone.</p>
            <div className="socials">
              {['in', '◎', '▶', 'f'].map((item) => <a href="#social" key={item}>{item}</a>)}
            </div>
          </div>
          {footerColumns.map(([title, ...links]) => (
            <div className="footer-column" key={title}>
              <h3>{title}</h3>
              {links.map((link) => <a href="#footer-link" key={link}>{link}</a>)}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <div className="shell">
            <p>© 2024 ARIGEO Co., Ltd. All rights reserved.</p>
            <div><a href="#terms">Terms of Use</a><a href="#privacy">Privacy Policy</a><a href="#sitemap">Sitemap</a></div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
