export interface Product {
  id: string
  slug: string
  name: string
  category: 'floor' | 'kitchen-bath' | 'specialty'
  categoryLabel: string
  price: number
  priceThai?: string
  description: string
  tagline: string
  emoji: string
  image?: string
  rating: {
    score: number
    count: number
  }
  benefits: string[]
  features: Array<{
    icon: string
    title: string
    description: string
  }>
  specifications: Record<string, string>
  usage: string[]
  warnings: string[]
  faqs: Array<{
    q: string
    a: string
  }>
  relatedProductIds?: string[]
}

export const products: Record<string, Product> = {
  'all-surface-floor-cleaner': {
    id: 'floor-cleaner-001',
    slug: 'all-surface-floor-cleaner',
    name: 'All-Surface Floor Cleaner',
    category: 'floor',
    categoryLabel: 'Floor Care',
    price: 199,
    priceThai: '199 บาท',
    description:
      'All-Surface Floor Cleaner is designed for Thai homes. Our climate—hot, humid, and demanding—requires a cleaning product that\'s both powerful and safe. This cleaner cuts through dirt, grime, and footprints on tile, marble, wood, and concrete, leaving your floors fresh and streak-free in one wipe.\n\nWhether you\'re cleaning after a tropical rainstorm tracked dirt indoors or just keeping your home pristine, one bottle handles every floor in your home.',
    tagline: 'Cleans tile, marble, and wood floors in one go. Fresh lemongrass scent. Safe for kids and pets.',
    emoji: '🧹',
    image: '/products/floor-cleaner.jpg',
    rating: { score: 4.8, count: 342 },
    benefits: [
      'Cleans all floor types (tile, marble, wood, concrete)',
      'Fresh lemongrass essential oil scent',
      'Non-toxic, safe for children and pets',
      'Biodegradable formula, eco-conscious packaging',
    ],
    features: [
      {
        icon: '💪',
        title: 'Powerful Formula',
        description: 'Cuts through dirt and grime in one wipe without harsh chemicals',
      },
      {
        icon: '🌿',
        title: 'Family-Safe',
        description: 'Non-toxic, hypoallergenic, safe for pets and sensitive skin',
      },
      {
        icon: '🌍',
        title: 'Eco-Conscious',
        description: 'Biodegradable, recyclable packaging made from recycled plastic',
      },
    ],
    specifications: {
      Size: '750 mL',
      'Active Ingredients': 'Plant-based surfactants, essential oils',
      'Safe for': 'Tile, marble, wood, concrete, linoleum',
      'pH Level': '11.2',
      Scent: 'Lemongrass',
      Storage: 'Cool, dry place (shelf life: 2 years)',
    },
    usage: [
      'Dilute 1 part cleaner to 3 parts water (adjust for soiled floors)',
      'Apply to floor with mop or cloth',
      'Wipe clean with damp cloth',
      'Allow to air dry (2–3 minutes)',
      'Enjoy sparkling, fresh floors',
    ],
    warnings: [
      'Keep out of reach of children',
      'Do not mix with other cleaners (especially bleach)',
      'Use in well-ventilated areas',
      'If ingested, call Poison Control immediately',
      'For external use only',
    ],
    faqs: [
      {
        q: 'How often should I use this?',
        a: 'For daily cleaning, dilute with 3 parts water. For deep cleaning (weekly), use a stronger concentration (1:2 ratio).',
      },
      {
        q: 'Can I use this on outdoor tiles?',
        a: 'Yes! The formula works on both indoor and outdoor tiled surfaces. Ensure proper ventilation when using outdoors.',
      },
      {
        q: 'Is it safe for pets and babies?',
        a: 'Absolutely. The formula is non-toxic and hypoallergenic. Ensure the floor is dry before allowing pets or babies to play on it.',
      },
      {
        q: 'Does it leave a residue?',
        a: 'No. When used correctly (with proper dilution), it leaves no residue. Always wipe with a damp cloth after cleaning.',
      },
      {
        q: 'What\'s the shelf life?',
        a: 'Unopened bottles last 2 years when stored in a cool, dry place. After opening, use within 1 year for best results.',
      },
    ],
    relatedProductIds: ['glass-cleaner-001', 'fabric-freshener-001'],
  },

  'glass-surface-cleaner': {
    id: 'glass-cleaner-001',
    slug: 'glass-surface-cleaner',
    name: 'Powerful Glass & Surface Cleaner',
    category: 'kitchen-bath',
    categoryLabel: 'Kitchen & Bath',
    price: 179,
    priceThai: '179 บาท',
    description:
      'Powerful Glass & Surface Cleaner delivers streak-free shine on windows, mirrors, and countertops. Formulated with our proprietary blend of plant-based surfactants and natural vinegar, this cleaner cuts through grease, water spots, and fingerprints in seconds.\n\nPerfect for kitchens, bathrooms, and living areas. The subtle lavender scent leaves your home smelling fresh without overpowering. Works on all glass and shiny surfaces.',
    tagline: 'Streak-free shine on windows, mirrors, and countertops. Leaves a subtle lavender scent behind.',
    emoji: '✨',
    image: '/products/glass-cleaner.jpg',
    rating: { score: 4.7, count: 287 },
    benefits: [
      'Streak-free shine guaranteed',
      'Works on glass, mirrors, stainless steel',
      'Subtle lavender scent (not overpowering)',
      'Dries fast, no smudges or fingerprints',
    ],
    features: [
      {
        icon: '💎',
        title: 'Crystal Clear',
        description: 'Leaves surfaces sparkling without streaks or residue',
      },
      {
        icon: '⚡',
        title: 'Fast Drying',
        description: 'Dries quickly without leaving fingerprints or spots',
      },
      {
        icon: '🍃',
        title: 'Natural Scent',
        description: 'Subtle lavender fragrance from natural essential oils',
      },
    ],
    specifications: {
      Size: '500 mL',
      'Active Ingredients': 'Plant-based surfactants, natural vinegar, essential oils',
      'Safe for': 'Glass, mirrors, stainless steel, tile, countertops',
      'pH Level': '4.5',
      Scent: 'Lavender',
      Storage: 'Room temperature, away from sunlight',
    },
    usage: [
      'Spray directly onto glass or mirror surface',
      'Wipe with a clean cloth or newspaper for streak-free shine',
      'For best results, wipe in one direction',
      'On stainless steel, wipe with the grain',
      'No dilution needed for most applications',
    ],
    warnings: [
      'Keep out of reach of children and pets',
      'Do not spray on hot or heated surfaces',
      'Ensure adequate ventilation when using',
      'Do not mix with other cleaning products',
      'In case of skin contact, rinse with water',
    ],
    faqs: [
      {
        q: 'Why do I still see streaks?',
        a: 'Streaks often result from using too much product or dirty cloths. Use less spray and wipe with a clean, lint-free cloth for best results.',
      },
      {
        q: 'Can I use this on my phone screen?',
        a: 'No, this product is not designed for electronics. Use a microfiber cloth or specialized electronics cleaner for phones and screens.',
      },
      {
        q: 'Is it safe for antique mirrors?',
        a: 'Test on a small, inconspicuous area first. Some antique mirrors have delicate backing that may be affected by moisture.',
      },
      {
        q: 'How much should I use per spray?',
        a: 'One or two light sprays per medium-sized window. More product doesn\'t mean better cleaning—less is often more for streak-free results.',
      },
      {
        q: 'Does the scent linger?',
        a: 'The lavender scent is subtle and dissipates quickly as the product dries. It won\'t overpower your room.',
      },
    ],
    relatedProductIds: ['all-surface-floor-cleaner', 'fabric-freshener-001'],
  },

  'fabric-upholstery-freshener': {
    id: 'fabric-freshener-001',
    slug: 'fabric-upholstery-freshener',
    name: 'Gentle Fabric & Upholstery Freshener',
    category: 'specialty',
    categoryLabel: 'Specialty Care',
    price: 249,
    priceThai: '249 บาท',
    description:
      'Gentle Fabric & Upholstery Freshener eliminates stubborn odors from sofas, carpets, mattresses, and curtains without damaging delicate fabrics. Our gentle formula penetrates fabric fibers to neutralize odors at the source while leaving a light, fresh fragrance.\n\nPerfect for pet owners, families with kids, or anyone who wants their upholstered furniture to smell like new. Safe for all fabric types and colors.',
    tagline: 'Removes odors from sofas, carpets, and mattresses. Gentle formula safe for all fabrics.',
    emoji: '🧤',
    image: '/products/fabric-freshener.jpg',
    rating: { score: 4.9, count: 456 },
    benefits: [
      'Removes stubborn odors from fabric',
      'Gentle formula won\'t damage delicate fabrics',
      'Works on sofas, carpets, mattresses, curtains',
      'Long-lasting freshness (lasts up to 2 weeks)',
    ],
    features: [
      {
        icon: '👃',
        title: 'Odor Elimination',
        description: 'Neutralizes odors at the source, not just masking them',
      },
      {
        icon: '🧵',
        title: 'Fabric Safe',
        description: 'Gentle enough for all fabric types without causing damage or discoloration',
      },
      {
        icon: '⏰',
        title: 'Long-Lasting',
        description: 'Freshness lasts up to 2 weeks with proper application',
      },
    ],
    specifications: {
      Size: '300 mL',
      'Active Ingredients': 'Plant-based odor neutralizers, natural fragrance oils',
      'Safe for': 'All fabric types, upholstery, carpets, mattresses, curtains',
      'pH Level': '6.0',
      Scent: 'Fresh floral blend',
      Storage: 'Room temperature, shake well before use',
    },
    usage: [
      'Shake well before each use',
      'Spray lightly over fabric surface from 15cm distance',
      'Allow fabric to air dry completely (30-60 minutes)',
      'For heavy odors, apply lightly a second time after first application dries',
      'Vacuum carpet after drying for best results',
    ],
    warnings: [
      'Test on a small, hidden area first to ensure color-fastness',
      'Do not oversaturate fabric—spray lightly',
      'Ensure proper ventilation while drying',
      'Keep away from direct heat sources and sunlight',
      'Keep out of reach of children and pets',
    ],
    faqs: [
      {
        q: 'How often can I use this on my furniture?',
        a: 'Use as needed, typically 1-2 times per month for regular maintenance. For heavy odors, you can use it weekly until the smell is gone.',
      },
      {
        q: 'Will it stain my furniture?',
        a: 'When used correctly (light spray, full drying), it should not stain. Always test on a hidden area first, especially on light-colored fabrics.',
      },
      {
        q: 'Is it safe for leather furniture?',
        a: 'No, this product is designed for fabric only. For leather, use a specialized leather care product.',
      },
      {
        q: 'Can I use this on my mattress?',
        a: 'Yes! Light spray on mattress surface, allow to dry completely before replacing bedding. This is especially helpful for pet owners.',
      },
      {
        q: 'How long does the freshness last?',
        a: 'With proper application, fragrance typically lasts 1-2 weeks depending on fabric, ventilation, and usage.',
      },
    ],
    relatedProductIds: ['all-surface-floor-cleaner', 'glass-cleaner-001'],
  },
}

export function getProduct(slug: string): Product | undefined {
  return Object.values(products).find((p) => p.slug === slug)
}

export function getProductsByCategory(category: string): Product[] {
  return Object.values(products).filter((p) => p.category === category)
}

export function getAllProducts(): Product[] {
  return Object.values(products)
}

export function getRelatedProducts(productId: string): Product[] {
  const product = Object.values(products).find((p) => p.id === productId)
  if (!product?.relatedProductIds) return []

  return product.relatedProductIds
    .map((id) => Object.values(products).find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p))
}
