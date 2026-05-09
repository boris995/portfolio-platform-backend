import type { Request, Response } from 'express';
import { Portfolio, Project, Report, User } from '../models';

const portfolioIncludes = [
  { model: User, as: 'owner', attributes: ['id', 'name', 'email', 'role'] },
  { model: Project, as: 'projects' },
];

export async function approvePortfolio(req: Request, res: Response) {
  const portfolio = await Portfolio.findByPk(String(req.params.id), {
    include: portfolioIncludes,
  });

  if (!portfolio) {
    return res.status(404).json({
      success: false,
      message: 'Portfolio not found',
    });
  }

  await portfolio.update({ status: 'approved' });

  return res.status(200).json({
    success: true,
    message: 'Portfolio approved',
    data: portfolio,
  });
}

export async function rejectPortfolio(req: Request, res: Response) {
  const portfolio = await Portfolio.findByPk(String(req.params.id), {
    include: portfolioIncludes,
  });

  if (!portfolio) {
    return res.status(404).json({
      success: false,
      message: 'Portfolio not found',
    });
  }

  await portfolio.update({ status: 'rejected', featured: false });

  return res.status(200).json({
    success: true,
    message: 'Portfolio rejected',
    data: portfolio,
  });
}

export async function featurePortfolio(req: Request, res: Response) {
  const portfolio = await Portfolio.findByPk(String(req.params.id), {
    include: portfolioIncludes,
  });

  if (!portfolio) {
    return res.status(404).json({
      success: false,
      message: 'Portfolio not found',
    });
  }

  await portfolio.update({ featured: !portfolio.featured });

  return res.status(200).json({
    success: true,
    message: portfolio.featured ? 'Portfolio featured' : 'Portfolio unfeatured',
    data: portfolio,
  });
}

export async function getUsers(_req: Request, res: Response) {
  const users = await User.findAll({
    attributes: ['id', 'name', 'email', 'role', 'status', 'createdAt'],
    order: [['createdAt', 'DESC']],
  });

  const portfolioCounts = await Portfolio.findAll({
    attributes: [
      'userId',
      [Portfolio.sequelize!.fn('COUNT', Portfolio.sequelize!.col('id')), 'count'],
    ],
    group: ['userId'],
    raw: true,
  });

  const countsByUserId = new Map(
    portfolioCounts.map((item) => [
      Number(item.userId),
      Number((item as unknown as { count: string | number }).count),
    ]),
  );

  return res.status(200).json({
    success: true,
    data: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      portfolios: countsByUserId.get(user.id) || 0,
    })),
  });
}

export async function deletePortfolioAsAdmin(req: Request, res: Response) {
  const portfolio = await Portfolio.findByPk(String(req.params.id));

  if (!portfolio) {
    return res.status(404).json({
      success: false,
      message: 'Portfolio not found',
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

export async function blockUser(req: Request, res: Response) {
  const user = await User.findByPk(String(req.params.id));

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  if (user.id === req.user?.id) {
    return res.status(400).json({
      success: false,
      message: 'You cannot block your own account',
    });
  }

  await user.update({
    status: user.status === 'blocked' ? 'active' : 'blocked',
  });

  return res.status(200).json({
    success: true,
    message: user.status === 'blocked' ? 'User blocked' : 'User unblocked',
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
}
