import type { Request, Response } from 'express';
import { Comment, Notification, Portfolio, Project, User } from '../models';
import AppError from '../utils/AppError';

const commentIncludes = [
  { model: User, as: 'author', attributes: ['id', 'name', 'email', 'role'] },
  { model: Project, as: 'project', attributes: ['id', 'title'] },
];

export async function getPortfolioComments(req: Request, res: Response) {
  const comments = await Comment.findAll({
    where: { portfolioId: req.params.portfolioId },
    include: commentIncludes,
    order: [['createdAt', 'DESC']],
  });

  return res.status(200).json({
    success: true,
    data: comments,
  });
}

export async function createComment(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError('Authentication is required', 401);
  }

  const portfolio = await Portfolio.findByPk(String(req.params.portfolioId));

  if (!portfolio) {
    throw new AppError('Portfolio not found', 404);
  }

  const { body, projectId } = req.body as {
    body: string;
    projectId?: number;
  };

  if (projectId) {
    const project = await Project.findOne({
      where: { id: projectId, portfolioId: portfolio.id },
    });

    if (!project) {
      throw new AppError('Project not found in this portfolio', 404);
    }
  }

  const comment = await Comment.create({
    userId: req.user.id,
    portfolioId: portfolio.id,
    projectId: projectId || null,
    body,
  });

  if (portfolio.userId !== req.user.id) {
    await Notification.create({
      userId: portfolio.userId,
      type: projectId ? 'project_commented' : 'portfolio_commented',
      message: projectId
        ? 'Someone commented on your project'
        : 'Someone commented on your portfolio',
      metadata: { portfolioId: portfolio.id, projectId, commentId: comment.id },
    });
  }

  const createdComment = await Comment.findByPk(comment.id, {
    include: commentIncludes,
  });

  return res.status(201).json({
    success: true,
    message: 'Comment created',
    data: createdComment,
  });
}

export async function deleteComment(req: Request, res: Response) {
  const comment = await Comment.findByPk(String(req.params.id), {
    include: [{ model: Portfolio, as: 'portfolio' }],
  });

  if (!comment) {
    throw new AppError('Comment not found', 404);
  }

  const canDelete =
    req.user?.role === 'admin' ||
    comment.userId === req.user?.id ||
    (comment as Comment & { portfolio?: Portfolio }).portfolio?.userId ===
      req.user?.id;

  if (!canDelete) {
    throw new AppError('You do not have permission to delete this comment', 403);
  }

  await comment.destroy();

  return res.status(200).json({
    success: true,
    message: 'Comment deleted',
  });
}
