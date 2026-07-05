// MARCUZ CONTENT CONSTANTS
// Single source of truth for all copy, labels, and messaging

// ============================================================================
// CALL-TO-ACTION COPY
// ============================================================================

export const CTA = {
  PRIMARY: 'Book a Discovery Session',
  SECONDARY: 'View Our Work',
  DISCOVER: 'Book a Discovery Session',
  VIEW_CASE_STUDIES: 'View Case Studies',
  READ_INSIGHTS: 'Read Our Insights',
  SUBSCRIBE: 'Subscribe to insights',
  LEARN_MORE: 'Learn More',
  GET_STARTED: 'Get Started',
  CONTACT_US: 'Contact Us',
  VIEW_WORK: 'View Our Work',
  EXPLORE_INSIGHTS: 'Explore Insights',
  START_TRANSFORMATION: 'Start Your Transformation',
  SCHEDULE_CALL: 'Schedule a Call',
  SEND_MESSAGE: 'Send Message',
  SUBMIT: 'Submit',
} as const;

// ============================================================================
// NAVIGATION
// ============================================================================

export const NAVIGATION = {
  BRAND: 'Marcuz',
  ITEMS: [
    { label: 'Home', href: '/', description: 'Back to home' },
    { label: 'Work', href: '/work', description: 'Case studies' },
    { label: 'Insights', href: '/insights', description: 'Knowledge hub' },
    { label: 'Discovery', href: '/discovery', description: 'Book session' },
  ],
  CTA_LABEL: 'Book Session',
  CTA_HREF: '/discovery',
} as const;

// ============================================================================
// SECTION TITLES
// ============================================================================

export const SECTION_TITLES = {
  HERO: 'Welcome to Marcuz',
  TRUSTED_RELATIONSHIPS: 'We partner with growing organizations.',
  BUSINESS_REALITY: 'The challenge every growing organization faces.',
  BELIEFS: 'Our philosophy.',
  TRANSFORMATION: 'From scattered to seamless.',
  OUTCOMES: 'What transformation looks like.',
  CASE_STUDIES: 'How transformation works in practice.',
  METHODOLOGY: 'Our methodology. Proven. Transparent. Human.',
  INSIGHTS: 'Learn how organizations transform.',
  DISCOVERY: 'Ready to rethink how your business works?',
} as const;

// ============================================================================
// FORM MESSAGES
// ============================================================================

export const FORM_MESSAGES = {
  // Discovery Form
  DISCOVERY_SUCCESS_HEADLINE: 'Thank you.',
  DISCOVERY_SUCCESS_MESSAGE: 'We\'ve received your request. We\'ll review it and reach out within 24 hours to find a time that works.\n\nLooking forward to the conversation.',
  DISCOVERY_ERROR: 'There was an error submitting your form. Please try again or contact us directly.',
  DISCOVERY_PRIVACY_FOOTER: 'We take privacy seriously. Your information is only used to schedule your discovery session.',

  // Newsletter
  NEWSLETTER_SUCCESS: 'Thank you for subscribing. Check your email for confirmation.',
  NEWSLETTER_ERROR: 'There was an error processing your subscription. Please try again.',

  // General
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  FORM_SENDING: 'Sending...',
  FORM_ERROR_GENERIC: 'Something went wrong. Please try again.',
} as const;

// ============================================================================
// VALIDATION MESSAGES
// ============================================================================

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  MIN_LENGTH: (min: number) => `Minimum ${min} characters required.`,
  MAX_LENGTH: (max: number) => `Maximum ${max} characters allowed.`,
  NAME_TOO_SHORT: 'Name must be at least 2 characters.',
  NAME_TOO_LONG: 'Name must not exceed 100 characters.',
  CHALLENGE_TOO_SHORT: 'Please provide at least 10 characters.',
  CHALLENGE_TOO_LONG: 'Maximum 1000 characters allowed.',
} as const;

// ============================================================================
// CONTACT INFORMATION
// ============================================================================

export const CONTACT = {
  EMAIL: 'hello@marcuz.com',
  PHONE: '+66 (2) 123-4567',
  WEBSITE: 'https://marcuz.com',
  LOCATIONS: {
    HEADQUARTERS: 'Bangkok, Thailand',
  },
} as const;

// ============================================================================
// SOCIAL PROOF & TESTIMONIALS
// ============================================================================

export const SOCIAL_PROOF = {
  HERO_SUBTEXT: 'Trusted by ORRY Thailand, Arigeo, and Cation Maid',
  CLIENTS: [
    'ORRY Thailand',
    'Arigeo',
    'Cation Maid',
  ],
} as const;

// ============================================================================
// METHODOLOGY STAGE NAMES
// ============================================================================

export const METHODOLOGY_STAGES = [
  { number: 1, name: 'Discover', purpose: 'Clarity' },
  { number: 2, name: 'Design', purpose: 'Strategy' },
  { number: 3, name: 'Build', purpose: 'Delivery' },
  { number: 4, name: 'Validate', purpose: 'Verification' },
  { number: 5, name: 'Improve', purpose: 'Optimization' },
] as const;

// ============================================================================
// OUTCOME CATEGORIES
// ============================================================================

export const OUTCOME_CATEGORIES = [
  'Operate Better',
  'Serve Customers Better',
  'Make Better Decisions',
  'Automate Repetitive Work',
  'Build AI Capabilities',
  'Scale Operations',
] as const;

// ============================================================================
// INSIGHT CATEGORIES
// ============================================================================

export const INSIGHT_CATEGORIES = [
  'AI & Automation',
  'Digital Transformation',
  'Workflow Design',
  'Business Strategy',
  'Industry Insights',
] as const;

// ============================================================================
// ERROR MESSAGES & EDGE CASES
// ============================================================================

export const ERROR_MESSAGES = {
  PAGE_NOT_FOUND: 'Page not found',
  SERVER_ERROR: 'Server error. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  FORM_SUBMISSION_FAILED: 'Form submission failed. Please try again.',
  INVALID_INPUT: 'Invalid input. Please check your entries.',
} as const;

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
  FORM_SUBMITTED: 'Form submitted successfully.',
  EMAIL_SENT: 'Email sent successfully.',
  SUBSCRIPTION_CONFIRMED: 'Subscription confirmed.',
} as const;

// ============================================================================
// FOOTER COPY
// ============================================================================

export const FOOTER = {
  BRAND_DESCRIPTION: 'Digital Transformation Partner helping organizations rethink how work gets done.',
  COLUMN_TITLES: {
    ABOUT: 'Marcuz',
    SERVICES: 'What We Do',
    LEARN: 'Insights',
    CONNECT: 'Get in Touch',
  },
  CONNECT_HEADLINE: 'Get in Touch',
  CONNECT_COPY: 'Let\'s talk about your business.',
  COPYRIGHT: '© 2026 Marcuz. All rights reserved.',
  LINKS: {
    PRIVACY_POLICY: 'Privacy Policy',
    TERMS: 'Terms',
  },
} as const;

// ============================================================================
// TRANSFORMATION KEYWORDS
// ============================================================================

export const TRANSFORMATION_KEYWORDS = {
  BEFORE: ['Disconnected', 'Manual', 'Slow', 'Siloed', 'Reactive'],
  AFTER: ['Connected', 'Automated', 'Fast', 'Unified', 'Proactive'],
} as const;

// ============================================================================
// BUSINESS CHALLENGES
// ============================================================================

export const BUSINESS_CHALLENGES = [
  'Manual work consuming time',
  'Information scattered across tools',
  'Slow approval processes',
  'Knowledge loss between team members',
  'Lack of visibility into operations',
  'Complexity scaling with growth',
] as const;

// ============================================================================
// BELIEF THEMES
// ============================================================================

export const BELIEF_THEMES = [
  'Technology simplicity',
  'Information quality',
  'AI amplification',
  'Business-first strategy',
  'Adaptive systems',
  'Process importance',
  'Partnership trust',
] as const;

// ============================================================================
// TONE & VOICE GUIDELINES
// ============================================================================

export const TONE = {
  PRIMARY: 'Consultative',
  SECONDARY: 'Business-focused',
  TERTIARY: 'Trusted advisor',
  ATTRIBUTES: [
    'Business-focused (not tech-focused)',
    'Consultative (not salesy)',
    'Clear (no jargon)',
    'Confident (not desperate)',
    'Human (not corporate)',
    'Humble (not arrogant)',
    'Smart (thought leadership)',
  ],
} as const;

// ============================================================================
// ACCESSIBILITY LABELS
// ============================================================================

export const ACCESSIBILITY = {
  SKIP_TO_MAIN: 'Skip to main content',
  OPEN_MENU: 'Open navigation menu',
  CLOSE_MENU: 'Close navigation menu',
  EXTERNAL_LINK: 'Opens in new window',
  REQUIRED_FIELD_INDICATOR: 'Required field',
} as const;

// ============================================================================
// BUTTON VARIANTS
// ============================================================================

export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  GHOST: 'ghost',
  SMALL: 'small',
} as const;

// ============================================================================
// SPACING & LAYOUT
// ============================================================================

export const LAYOUT = {
  MAX_WIDTH: '1200px',
  SECTION_PADDING: {
    MOBILE: '48px 24px',
    TABLET: '64px 48px',
    DESKTOP: '96px 64px',
  },
  GRID_COLUMNS: {
    MOBILE: 1,
    TABLET: 2,
    DESKTOP: 3,
  },
} as const;

// ============================================================================
// ANIMATIONS
// ============================================================================

export const ANIMATIONS = {
  FADE_IN_DURATION: 300,
  FADE_IN_EASING: 'easeOut',
  HOVER_DURATION: 200,
  SCROLL_TRIGGER_OFFSET: '20%',
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all CTA buttons used across the site
 */
export const getAllCTAs = () => Object.values(CTA);

/**
 * Get navigation structure
 */
export const getNavigation = () => NAVIGATION.ITEMS;

/**
 * Check if a link is external
 */
export const isExternalLink = (href: string): boolean => {
  return href.startsWith('http') || href.startsWith('www');
};

/**
 * Format contact email for display
 */
export const getContactEmail = (): string => CONTACT.EMAIL;

/**
 * Format contact phone for display
 */
export const getContactPhone = (): string => CONTACT.PHONE;

/**
 * Get all section titles
 */
export const getAllSectionTitles = () => Object.values(SECTION_TITLES);
