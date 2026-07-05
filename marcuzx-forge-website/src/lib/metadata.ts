// SEO Metadata for all pages

export const siteMetadata = {
  siteName: 'Marcuz',
  siteUrl: 'https://marcuz.com',
  description: 'Digital transformation partner helping organizations rethink how work gets done.',
  locale: 'en_US',
  twitter: '@marcuz',
  organization: {
    name: 'Marcuz',
    url: 'https://marcuz.com',
    logo: 'https://marcuz.com/logo.png',
    email: 'hello@marcuz.com',
  },
};

export const pageMetadata = {
  home: {
    title: 'Marcuz | Digital Transformation Partner',
    description: 'Digital transformation partner helping growing organizations redesign how they work through intelligent systems and AI-enabled automation.',
    keywords: ['digital transformation', 'workflow automation', 'AI integration', 'business optimization'],
    ogTitle: 'Marcuz | Digital Transformation Partner',
    ogDescription: 'Redesign how your organization works. We partner with growing businesses to build systems that scale.',
    ogImage: 'https://marcuz.com/og-home.jpg',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    canonical: 'https://marcuz.com',
  },
  caseStudies: {
    title: 'Case Studies | Marcuz Digital Transformation',
    description: 'See real transformations in action. From healthcare to retail, how organizations redesigned operations and achieved measurable results.',
    keywords: ['case studies', 'digital transformation examples', 'business transformation', 'workflow automation examples'],
    ogTitle: 'Case Studies | Marcuz',
    ogDescription: 'How ORRY Thailand, Arigeo, and Cation Maid transformed their operations with Marcuz.',
    ogImage: 'https://marcuz.com/og-case-studies.jpg',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    canonical: 'https://marcuz.com/case-studies',
  },
  insights: {
    title: 'Insights | Digital Strategy, Automation, and AI',
    description: 'Strategic insights on AI, automation, digital transformation, and building systems that work. Learn from every project we undertake.',
    keywords: ['digital transformation insights', 'AI automation', 'workflow design', 'business strategy', 'industry trends'],
    ogTitle: 'Insights | Marcuz',
    ogDescription: 'Expert perspectives on digital transformation, AI integration, and organizational change.',
    ogImage: 'https://marcuz.com/og-insights.jpg',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    canonical: 'https://marcuz.com/insights',
  },
  discovery: {
    title: 'Book a Discovery Session | Marcuz',
    description: 'Let\'s talk about your business challenges. Book a no-pressure discovery conversation with our team.',
    keywords: ['book consultation', 'digital transformation consultation', 'business strategy session'],
    ogTitle: 'Start Your Transformation | Marcuz',
    ogDescription: 'Schedule a discovery session. No pitch. No pressure. Just a thoughtful discussion about your challenges.',
    ogImage: 'https://marcuz.com/og-discovery.jpg',
    ogType: 'website',
    twitterCard: 'summary',
    canonical: 'https://marcuz.com/discovery',
  },
  orryCase: {
    title: 'ORRY Thailand | Case Study | Marcuz',
    description: 'How ORRY Thailand built a scalable e-commerce platform with unified data, automated workflows, and real-time insights.',
    keywords: ['e-commerce transformation', 'inventory automation', 'customer analytics'],
    ogTitle: 'ORRY Thailand Transformation | Marcuz',
    ogDescription: '40% faster order processing. 99% inventory accuracy. Real-time customer insights.',
    ogImage: 'https://marcuz.com/og-orry-case-study.jpg',
    ogType: 'article',
    twitterCard: 'summary_large_image',
    canonical: 'https://marcuz.com/case-studies/orry-thailand',
  },
};

// JSON-LD Structured Data

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Marcuz',
  url: 'https://marcuz.com',
  logo: 'https://marcuz.com/logo.png',
  description: 'Digital transformation partner helping organizations rethink how work gets done.',
  email: 'hello@marcuz.com',
  telephone: '+66-2-123-4567',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'TH',
    addressLocality: 'Bangkok',
  },
  sameAs: [
    'https://www.linkedin.com/company/marcuz',
    'https://twitter.com/marcuz',
  ],
  serviceArea: {
    '@type': 'Country',
    name: 'Thailand',
  },
  knowsAbout: [
    'Digital Transformation',
    'Workflow Automation',
    'AI Integration',
    'Business Optimization',
    'Systems Integration',
  ],
};

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Marcuz',
  image: 'https://marcuz.com/logo.png',
  description: 'Digital transformation partner',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Bangkok',
    addressLocality: 'Bangkok',
    addressCountry: 'TH',
  },
  telephone: '+66-2-123-4567',
  email: 'hello@marcuz.com',
  url: 'https://marcuz.com',
  priceRange: '$$',
};

export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Marcuz Digital Transformation',
  provider: {
    '@type': 'Organization',
    name: 'Marcuz',
    url: 'https://marcuz.com',
  },
  description: 'Digital transformation consulting and implementation services',
  areaServed: ['TH', 'SG', 'MY'],
  serviceType: [
    'Digital Transformation Consulting',
    'Workflow Design',
    'AI & Automation',
    'Systems Integration',
  ],
};

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const articleSchema = (article: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: article.headline,
  description: article.description,
  image: article.image,
  datePublished: article.datePublished,
  dateModified: article.dateModified || article.datePublished,
  author: {
    '@type': 'Organization',
    name: article.author || 'Marcuz',
  },
});

// Open Graph Meta Tags Helper
export const generateOpenGraphTags = (metadata: any) => ({
  'og:title': metadata.ogTitle || metadata.title,
  'og:description': metadata.ogDescription || metadata.description,
  'og:image': metadata.ogImage || 'https://marcuz.com/og-default.jpg',
  'og:type': metadata.ogType || 'website',
  'og:url': metadata.canonical || 'https://marcuz.com',
  'og:site_name': 'Marcuz',
  'og:locale': 'en_US',
});

// Twitter Card Meta Tags Helper
export const generateTwitterTags = (metadata: any) => ({
  'twitter:card': metadata.twitterCard || 'summary_large_image',
  'twitter:title': metadata.title,
  'twitter:description': metadata.description,
  'twitter:image': metadata.ogImage || 'https://marcuz.com/og-default.jpg',
  'twitter:site': '@marcuz',
});

// Helper to generate complete meta tags object
export const generateMetaTags = (pageKey: keyof typeof pageMetadata) => {
  const metadata = pageMetadata[pageKey];
  return {
    ...metadata,
    openGraph: generateOpenGraphTags(metadata),
    twitter: generateTwitterTags(metadata),
  };
};
