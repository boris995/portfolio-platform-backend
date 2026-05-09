import type { Request, Response } from 'express';
import { Portfolio, User } from '../models';

export async function approvePortfolio(req: Request, res: Response) {
  const portfolio = await Portfolio.findByPk(String(req.params.id));

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
  const portfolio = await Portfolio.findByPk(String(req.params.id));

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
  const portfolio = await Portfolio.findByPk(String(req.params.id));

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

  return res.status(200).json({
    success: true,
    data: users,
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
