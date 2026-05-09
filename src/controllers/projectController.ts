import type { Request, Response } from 'express';
import { Portfolio, Project } from '../models';
import { canManagePortfolio } from './portfolioController';

type ProjectBody = {
  title?: string;
  description?: string;
  tech?: string[] | string;
  image?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  views?: number;
  likes?: number;
};

const normalizeTech = (tech: ProjectBody['tech']) => {
  if (Array.isArray(tech)) {
    return tech.map((item) => item.trim()).filter(Boolean);
  }

  if (typeof tech === 'string') {
    return tech.split(',').map((item) => item.trim()).filter(Boolean);
  }

  return undefined;
};

export async function getPortfolioProjects(req: Request, res: Response) {
  const projects = await Project.findAll({
    where: { portfolioId: req.params.portfolioId },
    order: [['createdAt', 'DESC']],
  });

  return res.status(200).json({
    success: true,
    data: projects,
  });
}

export async function createProject(req: Request, res: Response) {
  const portfolio = await Portfolio.findByPk(String(req.params.portfolioId));

  if (!portfolio) {
    return res.status(404).json({
      success: false,
      message: 'Portfolio not found',
    });
  }

  if (!canManagePortfolio(req.user, portfolio)) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to add projects to this portfolio',
    });
  }

  const body = req.body as ProjectBody;

  if (!body.title) {
    return res.status(400).json({
      success: false,
      message: 'Project title is required',
    });
  }

  const project = await Project.create({
    portfolioId: portfolio.id,
    title: body.title,
    description: body.description || '',
    tech: normalizeTech(body.tech) || [],
    image: body.image || null,
    githubUrl: body.githubUrl || null,
    liveUrl: body.liveUrl || null,
    views: body.views ?? 0,
    likes: body.likes ?? 0,
  });

  return res.status(201).json({
    success: true,
    message: 'Project created',
    data: project,
  });
}

export async function updateProject(req: Request, res: Response) {
  const project = await Project.findByPk(String(req.params.id));

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  const portfolio = await Portfolio.findByPk(project.portfolioId);

  if (!portfolio || !canManagePortfolio(req.user, portfolio)) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to update this project',
    });
  }

  const body = req.body as ProjectBody;
  const tech = normalizeTech(body.tech);

  await project.update({
    title: body.title ?? project.title,
    description: body.description ?? project.description,
    tech: tech ?? project.tech,
    image: body.image ?? project.image,
    githubUrl: body.githubUrl ?? project.githubUrl,
    liveUrl: body.liveUrl ?? project.liveUrl,
    views: body.views ?? project.views,
    likes: body.likes ?? project.likes,
  });

  return res.status(200).json({
    success: true,
    message: 'Project updated',
    data: project,
  });
}

export async function deleteProject(req: Request, res: Response) {
  const project = await Project.findByPk(String(req.params.id));

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  const portfolio = await Portfolio.findByPk(project.portfolioId);

  if (!portfolio || !canManagePortfolio(req.user, portfolio)) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to delete this project',
    });
  }

  await project.destroy();

  return res.status(200).json({
    success: true,
    message: 'Project deleted',
  });
}
