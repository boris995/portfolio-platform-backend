import type { Request, Response } from 'express';
import { AnalyticsEvent, Portfolio, Project } from '../models';
import type { AnalyticsEventType } from '../models/AnalyticsEvent';
import AppError from '../utils/AppError';

const trackEvent = async (
  req: Request,
  type: AnalyticsEventType,
  portfolioId: number,
  projectId: number | null,
) => {
  await AnalyticsEvent.create({
    userId: req.user?.id || null,
    portfolioId,
    projectId,
    type,
  });
};

export async function trackPortfolioEvent(req: Request, res: Response) {
  const portfolio = await Portfolio.findByPk(String(req.params.portfolioId));
  const { type } = req.body as { type?: AnalyticsEventType };

  if (!portfolio) {
    throw new AppError('Portfolio not found', 404);
  }

  if (type !== 'github_click' && type !== 'live_demo_click') {
    throw new AppError('Unsupported analytics event', 400);
  }

  await trackEvent(req, type, portfolio.id, null);

  if (type === 'github_click' || type === 'live_demo_click') {
    await portfolio.increment('linkClicks');
  }

  return res.status(201).json({
    success: true,
    message: 'Analytics event tracked',
  });
}

export async function trackProjectView(req: Request, res: Response) {
  const project = await Project.findByPk(String(req.params.projectId));

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  await project.increment('views');
  await trackEvent(req, 'project_view', project.portfolioId, project.id);

  return res.status(201).json({
    success: true,
    message: 'Project view tracked',
  });
}
