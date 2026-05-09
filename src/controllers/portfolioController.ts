import type { Request, Response } from 'express';
import { Op, type Order, type WhereOptions } from 'sequelize';
import { AnalyticsEvent, Portfolio, Project, RecentView, Report, User } from '../models';
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
  followers?: number;
  likes?: number;
  linkClicks?: number;
};

const toPositiveInt = (value: unknown, fallback: number) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.floor(parsed);
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

export async function getPortfolios(req: Request, res: Response) {
  const page = toPositiveInt(req.query.page, 1);
  const limit = Math.min(toPositiveInt(req.query.limit, 20), 100);
  const offset = (page - 1) * limit;
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  const category =
    typeof req.query.category === 'string' ? req.query.category.trim() : '';
  const status = typeof req.query.status === 'string' ? req.query.status.trim() : '';
  const featured = typeof req.query.featured === 'string' ? req.query.featured : '';
  const sort = typeof req.query.sort === 'string' ? req.query.sort : 'newest';
  const where: WhereOptions = {};

  if (category) {
    where.category = category;
  }

  if (status === 'approved' || status === 'pending' || status === 'rejected') {
    where.status = status;
  }

  if (featured === 'true' || featured === 'false') {
    where.featured = featured === 'true';
  }

  if (search) {
    const matchingProjects = await Project.findAll({
      attributes: ['portfolioId'],
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          Project.sequelize!.where(
            Project.sequelize!.cast(Project.sequelize!.col('tech'), 'CHAR'),
            { [Op.like]: `%${search}%` },
          ),
        ],
      } as WhereOptions,
      raw: true,
    });
    const matchingPortfolioIds = matchingProjects.map(
      (project) => project.portfolioId,
    );

    Object.assign(where, {
      [Op.or]: [
      { title: { [Op.like]: `%${search}%` } },
      { slug: { [Op.like]: `%${search}%` } },
      { role: { [Op.like]: `%${search}%` } },
      { bio: { [Op.like]: `%${search}%` } },
      { location: { [Op.like]: `%${search}%` } },
      { category: { [Op.like]: `%${search}%` } },
      ...(matchingPortfolioIds.length
        ? [{ id: { [Op.in]: matchingPortfolioIds } }]
        : []),
      ],
    });
  }

  const order: Order =
    sort === 'views'
      ? [['views', 'DESC']]
      : sort === 'followers'
        ? [['followers', 'DESC']]
        : sort === 'name'
          ? [['title', 'ASC']]
          : [['createdAt', 'DESC']];

  const { count, rows: portfolios } = await Portfolio.findAndCountAll({
    where,
    include: [
      { model: User, as: 'owner', attributes: ['id', 'name', 'email', 'role'] },
      { model: Project, as: 'projects' },
    ],
    order,
    limit,
    offset,
    distinct: true,
  });

  return res.status(200).json({
    success: true,
    data: portfolios,
    meta: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    },
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

  await portfolio.increment('views');

  await AnalyticsEvent.create({
    userId: req.user?.id || null,
    portfolioId: portfolio.id,
    projectId: null,
    type: 'portfolio_view',
  });

  if (req.user) {
    await RecentView.upsert({
      userId: req.user.id,
      portfolioId: portfolio.id,
      viewedAt: new Date(),
    });
  }

  await portfolio.reload();

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
    followers: body.followers ?? 0,
    likes: body.likes ?? 0,
    linkClicks: body.linkClicks ?? 0,
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
          followers: body.followers ?? portfolio.followers,
          likes: body.likes ?? portfolio.likes,
          linkClicks: body.linkClicks ?? portfolio.linkClicks,
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

  await Report.destroy({ where: { portfolioId: portfolio.id } });
  await Project.destroy({ where: { portfolioId: portfolio.id } });
  await portfolio.destroy();

  return res.status(200).json({
    success: true,
    message: 'Portfolio deleted',
  });
}
