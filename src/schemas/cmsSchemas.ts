import { z } from 'zod';

const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(140)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase kebab-case');

export const cmsContentSchema = z.object({
  title: z.string().trim().min(2).max(180),
  slug: slugSchema,
  excerpt: z.string().trim().max(1000).optional(),
  content: z.string().trim().max(50000).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  seoTitle: z.string().trim().max(180).nullable().optional(),
  seoDescription: z.string().trim().max(260).nullable().optional(),
  featuredImageUrl: z.string().trim().max(500).nullable().optional(),
  publishedAt: z.string().datetime().nullable().optional(),
});

export const cmsContentUpdateSchema = cmsContentSchema.partial();

export const cmsServiceSchema = cmsContentSchema.extend({
  icon: z.string().trim().max(80).nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const cmsServiceUpdateSchema = cmsServiceSchema.partial();

export const cmsFaqSchema = z.object({
  question: z.string().trim().min(4).max(240),
  answer: z.string().trim().min(4).max(5000),
  category: z.string().trim().max(100).optional(),
  sortOrder: z.number().int().min(0).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  publishedAt: z.string().datetime().nullable().optional(),
});

export const cmsFaqUpdateSchema = cmsFaqSchema.partial();

export const contactSubmissionSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  subject: z.string().trim().max(180).optional(),
  message: z.string().trim().min(10).max(5000),
  website: z.string().trim().max(0).optional(),
});
