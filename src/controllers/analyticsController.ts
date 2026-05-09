import type { Request, Response } from 'express';
import { Op } from 'sequelize';
import { AnalyticsEvent, Portfolio, Project, Report, User } from '../models';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

const distributeMonthly = (total: number) =>
  months.map((month, index) => ({
    month,
    value: Math.max(4, Math.round((total / months.length) * (0.55 + index * 0.12))),
  }));

const sum = (values: Array<number | undefined>) =>
  values.reduce<number>((total, value) => total + (value || 0), 0);

const lastDays = (count: number) =>
  Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (count - index - 1));
    date.setHours(0, 0, 0, 0);
    return date;
  });

const formatDay = (date: Date) => date.toISOString().slice(0, 10);

export async function getUserAnalytics(req: Request, res: Response) {
  const portfolios = await Portfolio.findAll({
    where: { userId: req.user?.id },
    include: [{ model: Project, as: 'projects' }],
  });

  const portfolioIds = portfolios.map((portfolio) => portfolio.id);
  const projects = await Project.findAll({
    where: { portfolioId: portfolioIds },
    order: [['views', 'DESC']],
    limit: 5,
  });
  const allProjects = await Project.findAll({
    where: { portfolioId: portfolioIds },
  });
  const days = lastDays(14);
  const since = days[0] || new Date();
  const events = await AnalyticsEvent.findAll({
    where: {
      portfolioId: portfolioIds,
      createdAt: { [Op.gte]: since },
    },
  });
  const dailyViews = days.map((date) => {
    const day = formatDay(date);

    return {
      date: day,
      views: events.filter(
        (event) =>
          event.type === 'portfolio_view' && formatDay(event.createdAt) === day,
      ).length,
      githubClicks: events.filter(
        (event) =>
          event.type === 'github_click' && formatDay(event.createdAt) === day,
      ).length,
      liveDemoClicks: events.filter(
        (event) =>
          event.type === 'live_demo_click' && formatDay(event.createdAt) === day,
      ).length,
    };
  });

  const totalViews = sum(portfolios.map((portfolio) => portfolio.views));
  const followers = sum(portfolios.map((portfolio) => portfolio.followers));
  const likes = sum(portfolios.map((portfolio) => portfolio.likes));
  const linkClicks = sum(portfolios.map((portfolio) => portfolio.linkClicks));
  const maxProjectViews = Math.max(
    ...projects.map((project) => project.views || 0),
    1,
  );

  return res.status(200).json({
    success: true,
    data: {
      overview: {
        views: totalViews,
        followers,
        likes,
        linkClicks,
        portfolios: portfolios.length,
        projects: allProjects.length,
      },
      monthlyViews: distributeMonthly(totalViews),
      dailyViews,
      topProjects: projects.map((project) => ({
        id: project.id,
        title: project.title,
        views: project.views || 0,
        percentage: Math.round(((project.views || 0) / maxProjectViews) * 100),
      })),
      visitorSources: [
        { source: 'direct', percentage: 42 },
        { source: 'github', percentage: 28 },
        { source: 'linkedin', percentage: 19 },
      ],
    },
  });
}

export async function getAdminAnalytics(_req: Request, res: Response) {
  const [users, portfolios, projects, openReports, resolvedReports] =
    await Promise.all([
      User.count(),
      Portfolio.findAll(),
      Project.count(),
      Report.count({ where: { status: 'open' } }),
      Report.count({ where: { status: 'resolved' } }),
    ]);

  const totalViews = sum(portfolios.map((portfolio) => portfolio.views));
  const totalLikes = sum(portfolios.map((portfolio) => portfolio.likes));

  return res.status(200).json({
    success: true,
    data: {
      overview: {
        users,
        portfolios: portfolios.length,
        projects,
        views: totalViews,
        likes: totalLikes,
        reports: openReports + resolvedReports,
        openReports,
        resolvedReports,
      },
      monthlyViews: distributeMonthly(totalViews),
      moderation: {
        pendingPortfolios: portfolios.filter(
          (portfolio) => portfolio.status === 'pending',
        ).length,
        rejectedPortfolios: portfolios.filter(
          (portfolio) => portfolio.status === 'rejected',
        ).length,
        featuredPortfolios: portfolios.filter((portfolio) => portfolio.featured)
          .length,
      },
    },
  });
}
