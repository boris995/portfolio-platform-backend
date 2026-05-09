import type { Request, Response } from 'express';
import { Portfolio, Project, RecentView, User } from '../models';

export async function getRecentViews(req: Request, res: Response) {
  const recentViews = await RecentView.findAll({
    where: { userId: req.user?.id },
    include: [
      {
        model: Portfolio,
        as: 'portfolio',
        include: [
          { model: User, as: 'owner', attributes: ['id', 'name', 'email', 'role'] },
          { model: Project, as: 'projects' },
        ],
      },
    ],
    order: [['viewedAt', 'DESC']],
    limit: 10,
  });

  return res.status(200).json({
    success: true,
    data: recentViews,
  });
}
