import type { Request, Response } from 'express';
import { Portfolio, Project, User } from '../models';
import type { PortfolioCategory, PortfolioStatus } from '../models/Portfolio';

type PortfolioBody = {
  title?: string;
  slug?: string;
  role?: string;
  bio?: string;
  location?: string;
  category?: PortfolioCategory;
  avatar?: string;
  coverImage?: string;
  featured?: boolean;
  status?: PortfolioStatus;
  views?: number;
};

export const canManagePortfolio = (
  requestUser: Request['user'],
  portfolio: Portfolio,
) => requestUser?.role === 'admin' || portfolio.userId === requestUser?.id;

const createSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export async function getPortfolios(_req: Request, res: Response) {
  const portfolios = await Portfolio.findAll({
    include: [
      { model: User, as: 'owner', attributes: ['id', 'name', 'email', 'role'] },
      { model: Project, as: 'projects' },
    ],
    order: [['createdAt', 'DESC']],
  });

  return res.status(200).json({
    success: true,
    data: portfolios,
  });
}

export async function getPortfolioById(req: Request, res: Response) {
  const portfolio = await Portfolio.findByPk(String(req.params.id), {
    include: [
      { model: User, as: 'owner', attributes: ['id', 'name', 'email', 'role'] },
      { model: Project, as: 'projects' },
    ],
  });

  if (!portfolio) {
    return res.status(404).json({
      success: false,
      message: 'Portfolio not found',
    });
  }

  return res.status(200).json({
    success: true,
    data: portfolio,
  });
}

export async function getMyPortfolio(req: Request, res: Response) {
  const portfolio = await Portfolio.findOne({
    where: { userId: req.user?.id },
    include: [{ model: Project, as: 'projects' }],
  });

  return res.status(200).json({
    success: true,
    data: portfolio,
  });
}

export async function createPortfolio(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication is required',
    });
  }

  const body = req.body as PortfolioBody;

  if (!body.title || !body.role) {
    return res.status(400).json({
      success: false,
      message: 'Title and role are required',
    });
  }

  const portfolio = await Portfolio.create({
    userId: req.user.id,
    title: body.title,
    slug: body.slug || createSlug(body.title),
    role: body.role,
    bio: body.bio || '',
    location: body.location || '',
    category: body.category || 'Full Stack',
    avatar: body.avatar,
    coverImage: body.coverImage,
    featured: req.user.role === 'admin' ? Boolean(body.featured) : false,
    status: req.user.role === 'admin' ? body.status || 'approved' : 'pending',
    views: body.views ?? 0,
  });

  return res.status(201).json({
    success: true,
    message: 'Portfolio created',
    data: portfolio,
  });
}

export async function updatePortfolio(req: Request, res: Response) {
  const portfolio = await Portfolio.findByPk(String(req.params.id));

  if (!portfolio) {
    return res.status(404).json({
      success: false,
      message: 'Portfolio not found',
    });
  }

  if (!canManagePortfolio(req.user, portfolio)) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to update this portfolio',
    });
  }

  const body = req.body as PortfolioBody;
  const adminFields =
    req.user?.role === 'admin'
      ? {
          featured: body.featured ?? portfolio.featured,
          status: body.status ?? portfolio.status,
          views: body.views ?? portfolio.views,
        }
      : {};

  await portfolio.update({
    title: body.title ?? portfolio.title,
    slug: body.slug ?? portfolio.slug,
    role: body.role ?? portfolio.role,
    bio: body.bio ?? portfolio.bio,
    location: body.location ?? portfolio.location,
    category: body.category ?? portfolio.category,
    avatar: body.avatar ?? portfolio.avatar,
    coverImage: body.coverImage ?? portfolio.coverImage,
    ...adminFields,
  });

  return res.status(200).json({
    success: true,
    message: 'Portfolio updated',
    data: portfolio,
  });
}

export async function deletePortfolio(req: Request, res: Response) {
  const portfolio = await Portfolio.findByPk(String(req.params.id));

  if (!portfolio) {
    return res.status(404).json({
      success: false,
      message: 'Portfolio not found',
    });
  }

  if (!canManagePortfolio(req.user, portfolio)) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to delete this portfolio',
    });
  }

  await portfolio.destroy();

  return res.status(200).json({
    success: true,
    message: 'Portfolio deleted',
  });
}
