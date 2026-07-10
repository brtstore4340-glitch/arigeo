export type FormFieldType = 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio';

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormFieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  customMessage?: string;
}

export interface FormFieldAccessibility {
  ariaLabel: string;
  ariaDescription?: string;
  ariaRequired?: boolean;
}

export interface FormFieldDefinition {
  name: string;
  label: string;
  placeholder: string;
  type: FormFieldType;
  required: boolean;
  options?: FormFieldOption[];
  validation?: FormFieldValidation;
  accessibility: FormFieldAccessibility;
  helperText?: string;
}

export interface FormDefinitionGroup {
  formName: string;
  formId: string;
  title: string;
  description: string;
  fields: FormFieldDefinition[];
  submitButtonText: string;
  successMessage: string;
  errorMessage: string;
}

// Discovery Session Form Definition
export const discoveryFormDefinition: FormDefinitionGroup = {
  formName: 'Discovery Session',
  formId: 'discovery-session-form',
  title: 'Ready to rethink how your business works?',
  description: 'Tell us about yourself and your organization. We\'ll review and reach out within 24 hours.',
  fields: [
    {
      name: 'fullName',
      label: 'Your name',
      placeholder: 'John Smith',
      type: 'text',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 100,
      },
      accessibility: {
        ariaLabel: 'Full name',
        ariaDescription: 'Enter your full name',
        ariaRequired: true,
      },
    },
    {
      name: 'company',
      label: 'Company or organization',
      placeholder: 'Acme Inc.',
      type: 'text',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 100,
      },
      accessibility: {
        ariaLabel: 'Company or organization name',
        ariaDescription: 'Enter your company or organization name',
        ariaRequired: true,
      },
    },
    {
      name: 'email',
      label: 'Email',
      placeholder: 'you@company.com',
      type: 'email',
      required: true,
      validation: {
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        customMessage: 'Please enter a valid email address',
      },
      accessibility: {
        ariaLabel: 'Email address',
        ariaDescription: 'Enter your email address',
        ariaRequired: true,
      },
    },
    {
      name: 'phone',
      label: 'Phone (optional)',
      placeholder: '+66 (81) 456-7890',
      type: 'tel',
      required: false,
      validation: {
        pattern: '^[\\d\\s\\-\\+\\(\\)]*$',
        customMessage: 'Please enter a valid phone number',
      },
      accessibility: {
        ariaLabel: 'Phone number (optional)',
        ariaDescription: 'Enter your phone number if you prefer phone communication',
      },
    },
    {
      name: 'challenge',
      label: 'What\'s your biggest operational challenge right now?',
      placeholder: 'We\'re struggling with...',
      type: 'textarea',
      required: true,
      validation: {
        minLength: 10,
        maxLength: 1000,
        customMessage: 'Please provide at least 10 characters describing your challenge',
      },
      accessibility: {
        ariaLabel: 'Current operational challenge',
        ariaDescription: 'Describe your biggest operational challenge in detail',
        ariaRequired: true,
      },
      helperText: 'The more details you share, the better we can prepare for your session.',
    },
    {
      name: 'preferredTime',
      label: 'When would you prefer to connect?',
      placeholder: 'Select a time frame',
      type: 'select',
      required: true,
      options: [
        { label: 'This week', value: 'this-week' },
        { label: 'Next week', value: 'next-week' },
        { label: 'Next 2 weeks', value: 'next-2-weeks' },
        { label: 'Flexible', value: 'flexible' },
      ],
      accessibility: {
        ariaLabel: 'Preferred time to connect',
        ariaDescription: 'Select your preferred time frame for the discovery session',
        ariaRequired: true,
      },
    },
  ],
  submitButtonText: 'Book a Discovery Session',
  successMessage: 'Thank you. We\'ve received your request. We\'ll review it and reach out within 24 hours to find a time that works. Looking forward to the conversation.',
  errorMessage: 'There was an error submitting your form. Please try again or contact us directly.',
};

// Newsletter Signup Form Definition
export const newsletterFormDefinition: FormDefinitionGroup = {
  formName: 'Newsletter Signup',
  formId: 'newsletter-signup-form',
  title: 'Get insights delivered to your inbox',
  description: 'Subscribe to our monthly newsletter for strategic insights on digital transformation and AI.',
  fields: [
    {
      name: 'email',
      label: 'Email address',
      placeholder: 'you@company.com',
      type: 'email',
      required: true,
      validation: {
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        customMessage: 'Please enter a valid email address',
      },
      accessibility: {
        ariaLabel: 'Email address for newsletter',
        ariaDescription: 'Enter your email to subscribe to our newsletter',
        ariaRequired: true,
      },
    },
    {
      name: 'firstName',
      label: 'First name (optional)',
      placeholder: 'John',
      type: 'text',
      required: false,
      validation: {
        maxLength: 50,
      },
      accessibility: {
        ariaLabel: 'First name (optional)',
        ariaDescription: 'Enter your first name so we can personalize your emails',
      },
    },
    {
      name: 'company',
      label: 'Company (optional)',
      placeholder: 'Acme Inc.',
      type: 'text',
      required: false,
      validation: {
        maxLength: 100,
      },
      accessibility: {
        ariaLabel: 'Company name (optional)',
        ariaDescription: 'Enter your company name',
      },
    },
  ],
  submitButtonText: 'Subscribe',
  successMessage: 'Thank you for subscribing. Check your email for confirmation.',
  errorMessage: 'There was an error processing your subscription. Please try again.',
};

// Contact Form Definition
export const contactFormDefinition: FormDefinitionGroup = {
  formName: 'Contact Form',
  formId: 'contact-form',
  title: 'Get in touch',
  description: 'Have a question? Fill out the form below and we\'ll get back to you as soon as possible.',
  fields: [
    {
      name: 'name',
      label: 'Your name',
      placeholder: 'John Smith',
      type: 'text',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 100,
      },
      accessibility: {
        ariaLabel: 'Full name',
        ariaDescription: 'Enter your full name',
        ariaRequired: true,
      },
    },
    {
      name: 'email',
      label: 'Email address',
      placeholder: 'you@company.com',
      type: 'email',
      required: true,
      validation: {
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        customMessage: 'Please enter a valid email address',
      },
      accessibility: {
        ariaLabel: 'Email address',
        ariaDescription: 'Enter your email address',
        ariaRequired: true,
      },
    },
    {
      name: 'subject',
      label: 'Subject',
      placeholder: 'How can we help?',
      type: 'text',
      required: true,
      validation: {
        minLength: 5,
        maxLength: 200,
      },
      accessibility: {
        ariaLabel: 'Subject of your inquiry',
        ariaDescription: 'Enter the subject of your message',
        ariaRequired: true,
      },
    },
    {
      name: 'message',
      label: 'Message',
      placeholder: 'Tell us more about your inquiry...',
      type: 'textarea',
      required: true,
      validation: {
        minLength: 20,
        maxLength: 5000,
      },
      accessibility: {
        ariaLabel: 'Message content',
        ariaDescription: 'Enter your message in detail',
        ariaRequired: true,
      },
    },
  ],
  submitButtonText: 'Send Message',
  successMessage: 'Thank you for reaching out. We\'ve received your message and will respond shortly.',
  errorMessage: 'There was an error sending your message. Please try again or contact us directly.',
};

// Inquiry Form Definition (lightweight version)
export const inquiryFormDefinition: FormDefinitionGroup = {
  formName: 'Quick Inquiry',
  formId: 'quick-inquiry-form',
  title: 'Quick question?',
  description: 'Send us a quick message and we\'ll get back to you shortly.',
  fields: [
    {
      name: 'email',
      label: 'Your email',
      placeholder: 'you@company.com',
      type: 'email',
      required: true,
      validation: {
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      },
      accessibility: {
        ariaLabel: 'Email address',
        ariaRequired: true,
      },
    },
    {
      name: 'inquiry',
      label: 'Your question',
      placeholder: 'Type your question here...',
      type: 'textarea',
      required: true,
      validation: {
        minLength: 5,
        maxLength: 500,
      },
      accessibility: {
        ariaLabel: 'Question or inquiry',
        ariaRequired: true,
      },
    },
  ],
  submitButtonText: 'Send',
  successMessage: 'Thanks for your question. We\'ll be in touch soon.',
  errorMessage: 'Something went wrong. Please try again.',
};

// Export all form definitions
export const formDefinitions = {
  discovery: discoveryFormDefinition,
  newsletter: newsletterFormDefinition,
  contact: contactFormDefinition,
  inquiry: inquiryFormDefinition,
};

// Helper functions

export const getFormDefinition = (formType: keyof typeof formDefinitions) => {
  return formDefinitions[formType];
};

export const getFormField = (
  formType: keyof typeof formDefinitions,
  fieldName: string
): FormFieldDefinition | undefined => {
  const form = formDefinitions[formType];
  return form.fields.find(f => f.name === fieldName);
};

export const validateFormField = (
  field: FormFieldDefinition,
  value: string
): { valid: boolean; error?: string } => {
  if (field.required && !value?.trim()) {
    return { valid: false, error: `${field.label} is required` };
  }

  if (value && field.validation) {
    if (field.validation.minLength && value.length < field.validation.minLength) {
      return {
        valid: false,
        error: field.validation.customMessage || `Minimum ${field.validation.minLength} characters required`,
      };
    }

    if (field.validation.maxLength && value.length > field.validation.maxLength) {
      return {
        valid: false,
        error: field.validation.customMessage || `Maximum ${field.validation.maxLength} characters allowed`,
      };
    }

    if (field.validation.pattern) {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(value)) {
        return {
          valid: false,
          error: field.validation.customMessage || 'Invalid format',
        };
      }
    }
  }

  return { valid: true };
};
