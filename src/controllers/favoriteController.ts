import type { Request, Response } from 'express';
import { Favorite, Notification, Portfolio, Project, User } from '../models';
import AppError from '../utils/AppError';

const portfolioIncludes = [
  { model: User, as: 'owner', attributes: ['id', 'name', 'email', 'role'] },
  { model: Project, as: 'projects' },
];

export async function getFavorites(req: Request, res: Response) {
  const favorites = await Favorite.findAll({
    where: { userId: req.user?.id },
    order: [['createdAt', 'DESC']],
  });

  const portfolioIds = favorites.map((favorite) => favorite.portfolioId);
  const portfolios = await Portfolio.findAll({
    where: { id: portfolioIds },
    include: portfolioIncludes,
  });

  return res.status(200).json({
    success: true,
    data: portfolios,
  });
}

export async function addFavorite(req: Request, res: Response) {
  const portfolio = await Portfolio.findByPk(String(req.params.portfolioId), {
    include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email', 'role'] }],
  });

  if (!portfolio || !req.user) {
    throw new AppError('Portfolio not found', 404);
  }

  const [, created] = await Favorite.findOrCreate({
    where: { userId: req.user.id, portfolioId: portfolio.id },
    defaults: { userId: req.user.id, portfolioId: portfolio.id },
  });

  if (created) {
    await portfolio.increment('likes');

    if (portfolio.userId !== req.user.id) {
      await Notification.create({
        userId: portfolio.userId,
        type: 'portfolio_liked',
        message: 'Someone saved your portfolio',
        metadata: { portfolioId: portfolio.id, actorId: req.user.id },
      });
    }
  }

  await portfolio.reload({ include: portfolioIncludes });

  return res.status(200).json({
    success: true,
    message: created ? 'Portfolio saved' : 'Portfolio already saved',
    data: portfolio,
  });
}

export async function removeFavorite(req: Request, res: Response) {
  const portfolio = await Portfolio.findByPk(String(req.params.portfolioId));

  if (!portfolio || !req.user) {
    throw new AppError('Portfolio not found', 404);
  }

  const deleted = await Favorite.destroy({
    where: { userId: req.user.id, portfolioId: portfolio.id },
  });

  if (deleted && portfolio.likes > 0) {
    await portfolio.decrement('likes');
  }

  return res.status(200).json({
    success: true,
    message: 'Portfolio removed from favorites',
  });
}
