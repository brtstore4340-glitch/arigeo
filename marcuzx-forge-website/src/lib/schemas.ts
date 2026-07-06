import { z } from 'zod';

// Discovery Session Form Schema
export const DiscoveryFormSchema = z.object({
  fullName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  company: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must not exceed 100 characters'),
  email: z.string()
    .email('Please enter a valid email address'),
  phone: z.string()
    .regex(/^[\d\s\-\+\(\)]*$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  challenge: z.string()
    .min(10, 'Challenge description must be at least 10 characters')
    .max(1000, 'Challenge description must not exceed 1000 characters'),
  preferredTime: z.enum(['This week', 'Next week', 'Next 2 weeks', 'Flexible']),
});

export type DiscoveryFormData = z.infer<typeof DiscoveryFormSchema>;

// Newsletter Signup Form Schema
export const NewsletterSignupSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address'),
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must not exceed 50 characters')
    .optional()
    .or(z.literal('')),
  company: z.string()
    .max(100, 'Company name must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
});

export type NewsletterSignupData = z.infer<typeof NewsletterSignupSchema>;

// Contact Form Schema (if applicable)
export const ContactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: z.string()
    .email('Please enter a valid email address'),
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must not exceed 200 characters'),
  message: z.string()
    .min(20, 'Message must be at least 20 characters')
    .max(5000, 'Message must not exceed 5000 characters'),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;

// Content Validation Schemas

// Hero Section
export const HeroContentSchema = z.object({
  headline: z.string().min(1),
  headlineAlternatives: z.array(z.string()).min(1),
  subheading: z.string().min(1),
  body: z.string().min(1),
  cta: z.object({
    primary: z.string().min(1),
    secondary: z.string().min(1),
  }),
  socialProof: z.string().min(1),
});

// Problem Card
export const ProblemCardSchema = z.object({
  headline: z.string().min(1),
  description: z.string().min(1),
  impact: z.string().min(1),
});

// Business Reality Section
export const BusinessRealitySchema = z.object({
  headline: z.string().min(1),
  intro: z.string().min(1),
  problems: z.array(ProblemCardSchema).min(6).max(7),
});

// Belief Card
export const BeliefCardSchema = z.object({
  headline: z.string().min(1),
  description: z.string().min(1),
});

// Beliefs Section
export const BeliefsSchema = z.object({
  headline: z.string().min(1),
  intro: z.string().min(1),
  beliefs: z.array(BeliefCardSchema).min(7),
});

// Transformation Section
export const TransformationSchema = z.object({
  headline: z.string().min(1),
  intro: z.string().min(1),
  beforeState: z.object({
    headline: z.string().min(1),
    elements: z.array(z.string()).min(6),
  }),
  transitionText: z.string().min(1),
  afterState: z.object({
    headline: z.string().min(1),
    elements: z.array(z.string()).min(6),
  }),
  examples: z.array(z.object({
    industry: z.string().min(1),
    before: z.string().min(1),
    after: z.string().min(1),
  })).min(3),
});

// Outcome Card
export const OutcomeCardSchema = z.object({
  headline: z.string().min(1),
  description: z.string().min(1),
  examples: z.array(z.string()).min(4),
});

// Outcomes Section
export const OutcomesSchema = z.object({
  headline: z.string().min(1),
  intro: z.string().min(1),
  outcomes: z.array(OutcomeCardSchema).min(6),
});

// Methodology Stage
export const MethodologyStageSchema = z.object({
  number: z.number().min(1).max(5),
  name: z.string().min(1),
  headline: z.string().min(1),
  duration: z.string().min(1),
  purpose: z.string().min(1),
  whatHappens: z.array(z.string()).min(5),
  deliverable: z.string().min(1),
  humanCenteredApproach: z.string().min(1),
});

// Methodology Section
export const MethodologySchema = z.object({
  headline: z.string().min(1),
  intro: z.string().min(1),
  stages: z.array(MethodologyStageSchema).min(5),
});

// Insights Category
export const InsightsCategorySchema = z.object({
  name: z.string().min(1),
  articles: z.array(z.string()).min(3),
});

// Insights Section
export const InsightsSchema = z.object({
  headline: z.string().min(1),
  intro: z.string().min(1),
  categories: z.array(InsightsCategorySchema).min(5),
  cta: z.object({
    primary: z.string().min(1),
    secondary: z.string().min(1),
  }),
});

// Discovery Section
export const DiscoverySectionSchema = z.object({
  headline: z.string().min(1),
  subheading: z.string().min(1),
  formIntro: z.string().min(1),
  formFields: z.array(z.object({
    name: z.string().min(1),
    label: z.string().min(1),
    placeholder: z.string().min(1),
    type: z.string().min(1),
    required: z.boolean(),
  })).min(6),
  submitButton: z.string().min(1),
  postSubmitMessage: z.object({
    headline: z.string().min(1),
    copy: z.string().min(1),
  }),
  privacyFooter: z.string().min(1),
});

// Navigation
export const NavigationItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  description: z.string().optional(),
});

export const NavigationSchema = z.object({
  brand: z.string().min(1),
  items: z.array(NavigationItemSchema).min(4),
  cta: z.object({
    label: z.string().min(1),
    href: z.string().min(1),
  }),
});

// Footer
export const FooterColumnSchema = z.object({
  title: z.string().min(1),
  copy: z.string().optional(),
  links: z.array(z.object({
    label: z.string().min(1),
    href: z.string().min(1),
  })).optional(),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().min(1),
  }).optional(),
});

export const FooterSchema = z.object({
  columns: z.array(FooterColumnSchema).min(4),
  copyright: z.string().min(1),
  links: z.array(z.object({
    label: z.string().min(1),
    href: z.string().min(1),
  })),
});

// Complete Content Schema
export const ContentSchema = z.object({
  meta: z.object({
    project: z.string(),
    version: z.string(),
    date: z.string(),
    status: z.string(),
    tone: z.string(),
  }),
  hero: HeroContentSchema,
  trustedRelationships: z.object({
    headline: z.string().min(1),
    intro: z.string().min(1),
    clients: z.array(z.object({
      name: z.string().min(1),
      role: z.string().min(1),
      status: z.string().min(1),
    })).min(3),
  }),
  businessReality: BusinessRealitySchema,
  beliefs: BeliefsSchema,
  transformation: TransformationSchema,
  outcomes: OutcomesSchema,
  caseStudies: z.object({
    intro: z.string().min(1),
    featured: z.object({
      client: z.string().min(1),
      clientType: z.string().min(1),
      headline: z.string().min(1),
      sections: z.object({
        challenge: z.object({
          headline: z.string().min(1),
          copy: z.string().min(1),
        }),
        thinking: z.object({
          headline: z.string().min(1),
          copy: z.string().min(1),
        }),
        solution: z.object({
          headline: z.string().min(1),
          copy: z.string().min(1),
        }),
        outcome: z.object({
          headline: z.string().min(1),
          copy: z.string().min(1),
        }),
      }),
      cta: z.string().min(1),
    }),
    secondary: z.array(z.object({
      client: z.string().min(1),
      headline: z.string().min(1),
      status: z.string().optional(),
    })).min(2),
  }),
  methodology: MethodologySchema,
  insights: InsightsSchema,
  discovery: DiscoverySectionSchema,
  navigation: NavigationSchema,
  footer: FooterSchema,
});

export type ContentData = z.infer<typeof ContentSchema>;

// SEO Metadata Schema
export const SeoMetadataSchema = z.object({
  title: z.string()
    .min(30, 'Title must be at least 30 characters')
    .max(60, 'Title must not exceed 60 characters'),
  description: z.string()
    .min(120, 'Description must be at least 120 characters')
    .max(160, 'Description must not exceed 160 characters'),
  keywords: z.array(z.string()).optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().url().optional(),
  twitterCard: z.enum(['summary', 'summary_large_image', 'app', 'player']).optional(),
  canonical: z.string().url().optional(),
});

export type SeoMetadata = z.infer<typeof SeoMetadataSchema>;

// Form Field Definition Schema
export const FormFieldSchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  placeholder: z.string(),
  type: z.enum(['text', 'email', 'tel', 'textarea', 'select', 'checkbox', 'radio']),
  required: z.boolean(),
  options: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).optional(),
  validation: z.object({
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    pattern: z.string().optional(),
    customMessage: z.string().optional(),
  }).optional(),
  accessibility: z.object({
    ariaLabel: z.string(),
    ariaDescription: z.string().optional(),
    ariaRequired: z.boolean().optional(),
  }).optional(),
});

export type FormField = z.infer<typeof FormFieldSchema>;

// Validation helper function
export const validateContent = (data: unknown): { valid: boolean; errors?: string[] } => {
  try {
    ContentSchema.parse(data);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
      };
    }
    return { valid: false, errors: ['Unknown validation error'] };
  }
};
