import { z } from 'zod';

export const portfolioSchema = z.object({
  title: z.string().trim().min(2).max(140).optional(),
  slug: z.string().trim().min(2).max(100).optional(),
  role: z.string().trim().min(2).max(120).optional(),
  bio: z.string().trim().max(5000).optional(),
  location: z.string().trim().max(140).optional(),
  category: z.enum(['Frontend', 'Backend', 'Full Stack', 'UI/UX', 'Mobile', 'DevOps']).optional(),
  avatar: z.string().trim().max(500).optional(),
  coverImage: z.string().trim().max(500).optional(),
  featured: z.boolean().optional(),
  status: z.enum(['approved', 'pending', 'rejected']).optional(),
  views: z.number().int().min(0).optional(),
  followers: z.number().int().min(0).optional(),
  likes: z.number().int().min(0).optional(),
  linkClicks: z.number().int().min(0).optional(),
});

export const createPortfolioSchema = portfolioSchema.extend({
  title: z.string().trim().min(2).max(140),
  role: z.string().trim().min(2).max(120),
});

export const projectSchema = z.object({
  title: z.string().trim().min(2).max(140).optional(),
  description: z.string().trim().max(5000).optional(),
  tech: z.union([z.array(z.string().trim().min(1).max(60)), z.string().trim()]).optional(),
  image: z.string().trim().max(500).nullable().optional(),
  githubUrl: z.string().trim().max(500).nullable().optional(),
  liveUrl: z.string().trim().max(500).nullable().optional(),
  views: z.number().int().min(0).optional(),
  likes: z.number().int().min(0).optional(),
});

export const createProjectSchema = projectSchema.extend({
  title: z.string().trim().min(2).max(140),
});

export const reportSchema = z.object({
  portfolioId: z.number().int().positive(),
  reason: z.string().trim().min(3).max(180),
  details: z.string().trim().max(5000).optional(),
});

export const commentSchema = z.object({
  body: z.string().trim().min(1).max(1200),
  projectId: z.number().int().positive().optional(),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  email: z.string().trim().email().max(180).optional(),
});

export const passwordSchema = z.object({
  currentPassword: z.string().min(1).max(120),
  newPassword: z.string().min(6).max(120),
});
