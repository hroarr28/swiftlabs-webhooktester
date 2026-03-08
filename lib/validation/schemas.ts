/**
 * Form Validation Schemas
 * 
 * Type-safe form validation with Zod.
 * Use these schemas for both client and server-side validation.
 * 
 * @see FORM_VALIDATION_PATTERN.md for usage examples
 */

import { z } from 'zod';

/**
 * Common field validators (reusable)
 */
export const validators = {
  /**
   * Email validation
   */
  email: z.string().email('Invalid email address'),
  
  /**
   * Password validation (min 8 chars, requires uppercase, lowercase, number)
   */
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  
  /**
   * URL validation
   */
  url: z.string().url('Invalid URL'),
  
  /**
   * Phone number (UK format)
   */
  phoneUK: z
    .string()
    .regex(/^(\+44|0)7\d{9}$/, 'Invalid UK phone number'),
  
  /**
   * Postcode (UK format)
   */
  postcodeUK: z
    .string()
    .regex(
      /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i,
      'Invalid UK postcode'
    ),
  
  /**
   * Slug (URL-friendly string)
   */
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  
  /**
   * Required string (non-empty)
   */
  requiredString: z.string().min(1, 'This field is required'),
  
  /**
   * Optional string
   */
  optionalString: z.string().optional(),
  
  /**
   * Positive integer
   */
  positiveInt: z.number().int().positive('Must be a positive number'),
  
  /**
   * Price (max 2 decimal places)
   */
  price: z
    .number()
    .positive('Price must be positive')
    .multipleOf(0.01, 'Price cannot have more than 2 decimal places'),
};

/**
 * Authentication schemas
 */
export const authSchemas = {
  /**
   * Login form
   */
  login: z.object({
    email: validators.email,
    password: z.string().min(1, 'Password is required'),
  }),
  
  /**
   * Registration form
   */
  register: z.object({
    name: validators.requiredString,
    email: validators.email,
    password: validators.password,
    confirmPassword: z.string(),
  }).refine(
    (data) => data.password === data.confirmPassword,
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  ),
  
  /**
   * Password reset request
   */
  passwordResetRequest: z.object({
    email: validators.email,
  }),
  
  /**
   * Password reset
   */
  passwordReset: z.object({
    token: z.string().min(1, 'Invalid token'),
    password: validators.password,
    confirmPassword: z.string(),
  }).refine(
    (data) => data.password === data.confirmPassword,
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  ),
};

/**
 * User profile schemas
 */
export const profileSchemas = {
  /**
   * Update profile
   */
  updateProfile: z.object({
    name: validators.requiredString,
    email: validators.email,
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    website: validators.url.optional().or(z.literal('')),
    location: validators.optionalString,
  }),
  
  /**
   * Change password
   */
  changePassword: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: validators.password,
    confirmPassword: z.string(),
  }).refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  ),
};

/**
 * Contact form schema
 */
export const contactSchema = z.object({
  name: validators.requiredString,
  email: validators.email,
  subject: validators.requiredString,
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

/**
 * Settings schemas
 */
export const settingsSchemas = {
  /**
   * Notification preferences
   */
  notifications: z.object({
    emailNotifications: z.boolean(),
    weeklyDigest: z.boolean(),
    productUpdates: z.boolean(),
    marketingEmails: z.boolean(),
  }),
  
  /**
   * Privacy settings
   */
  privacy: z.object({
    profilePublic: z.boolean(),
    showEmail: z.boolean(),
    allowIndexing: z.boolean(),
  }),
};

/**
 * Blog/content schemas
 */
export const contentSchemas = {
  /**
   * Create/edit blog post
   */
  blogPost: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    slug: validators.slug,
    excerpt: z.string().min(10, 'Excerpt must be at least 10 characters').max(300),
    content: z.string().min(50, 'Content must be at least 50 characters'),
    category: validators.requiredString,
    tags: z.array(z.string()).optional(),
    published: z.boolean(),
    publishedAt: z.date().optional(),
  }),
  
  /**
   * Comment form
   */
  comment: z.object({
    name: validators.requiredString,
    email: validators.email,
    content: z.string().min(3, 'Comment must be at least 3 characters').max(1000),
  }),
};

/**
 * Team/collaboration schemas
 */
export const teamSchemas = {
  /**
   * Invite team member
   */
  inviteMember: z.object({
    email: validators.email,
    role: z.enum(['admin', 'member', 'viewer']),
    message: z.string().max(500).optional(),
  }),
  
  /**
   * Update member role
   */
  updateMemberRole: z.object({
    userId: z.string().uuid('Invalid user ID'),
    role: z.enum(['admin', 'member', 'viewer']),
  }),
};

/**
 * Billing schemas
 */
export const billingSchemas = {
  /**
   * Update payment method
   */
  updatePaymentMethod: z.object({
    cardNumber: z.string().regex(/^\d{16}$/, 'Invalid card number'),
    expiryMonth: z.number().min(1).max(12),
    expiryYear: z.number().min(new Date().getFullYear()),
    cvc: z.string().regex(/^\d{3,4}$/, 'Invalid CVC'),
  }),
  
  /**
   * Update billing address
   */
  updateBillingAddress: z.object({
    line1: validators.requiredString,
    line2: validators.optionalString,
    city: validators.requiredString,
    postcode: validators.postcodeUK,
    country: z.string().length(2, 'Country code must be 2 characters'),
  }),
};

/**
 * API/integration schemas
 */
export const apiSchemas = {
  /**
   * Create API key
   */
  createApiKey: z.object({
    name: validators.requiredString,
    permissions: z.array(z.enum(['read', 'write', 'delete'])),
    expiresAt: z.date().optional(),
  }),
  
  /**
   * Webhook configuration
   */
  webhook: z.object({
    url: validators.url,
    events: z.array(z.string()).min(1, 'Select at least one event'),
    secret: z.string().min(16, 'Secret must be at least 16 characters').optional(),
    active: z.boolean(),
  }),
};

/**
 * Type exports (inferred from schemas)
 */
export type LoginInput = z.infer<typeof authSchemas.login>;
export type RegisterInput = z.infer<typeof authSchemas.register>;
export type UpdateProfileInput = z.infer<typeof profileSchemas.updateProfile>;
export type ContactInput = z.infer<typeof contactSchema>;
export type BlogPostInput = z.infer<typeof contentSchemas.blogPost>;
export type InviteMemberInput = z.infer<typeof teamSchemas.inviteMember>;
export type WebhookInput = z.infer<typeof apiSchemas.webhook>;
