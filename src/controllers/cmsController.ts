import type { Request, Response } from 'express';
import type { Model, ModelStatic, Order } from 'sequelize';
import {
  CmsFaq,
  CmsPage,
  CmsPost,
  CmsService,
  ContactSubmission,
} from '../models';
import AppError from '../utils/AppError';

type CmsModel = ModelStatic<Model<Record<string, unknown>, Record<string, unknown>>>;

const publishedWhere = { status: 'published' };

const contentModels: Record<string, CmsModel> = {
  pages: CmsPage as unknown as CmsModel,
  posts: CmsPost as unknown as CmsModel,
  services: CmsService as unknown as CmsModel,
  faqs: CmsFaq as unknown as CmsModel,
};

const getModel = (resource: string) => {
  const model = contentModels[resource as keyof typeof contentModels];

  if (!model) {
    throw new AppError('CMS resource not found', 404);
  }

  return model;
};

const normalizePublishedAt = (
  body: Record<string, unknown>,
  withDefaults = false,
): Record<string, any> => {
  const payload: Record<string, any> = {
    ...body,
    publishedAt:
      typeof body.publishedAt === 'string'
        ? new Date(body.publishedAt)
        : body.publishedAt,
  };

  if (withDefaults) {
    payload.excerpt = typeof body.excerpt === 'string' ? body.excerpt : '';
    payload.content = typeof body.content === 'string' ? body.content : '';
  }

  return payload;
};

export async function getPublicCollection(req: Request, res: Response) {
  const model = getModel(String(req.params.resource));
  const order: Order =
    req.params.resource === 'services' || req.params.resource === 'faqs'
      ? [['sortOrder', 'ASC'], ['createdAt', 'DESC']]
      : [['publishedAt', 'DESC'], ['createdAt', 'DESC']];

  const items = await model.findAll({
    where: publishedWhere,
    order,
  });

  return res.status(200).json({
    success: true,
    data: items,
  });
}

export async function getPublicBySlug(req: Request, res: Response) {
  const model = getModel(String(req.params.resource));
  const item = await model.findOne({
    where: { slug: req.params.slug, ...publishedWhere },
  });

  if (!item) {
    throw new AppError('CMS content not found', 404);
  }

  return res.status(200).json({
    success: true,
    data: item,
  });
}

export async function getAdminCollection(req: Request, res: Response) {
  const model = getModel(String(req.params.resource));
  const items = await model.findAll({
    order: [['updatedAt', 'DESC']],
  });

  return res.status(200).json({
    success: true,
    data: items,
  });
}

export async function getAdminItem(req: Request, res: Response) {
  const model = getModel(String(req.params.resource));
  const item = await model.findByPk(String(req.params.id));

  if (!item) {
    throw new AppError('CMS content not found', 404);
  }

  return res.status(200).json({
    success: true,
    data: item,
  });
}

export async function createAdminItem(req: Request, res: Response) {
  const model = getModel(String(req.params.resource));
  const item = await model.create(normalizePublishedAt(req.body, true));

  return res.status(201).json({
    success: true,
    message: 'CMS content created',
    data: item,
  });
}

export async function updateAdminItem(req: Request, res: Response) {
  const model = getModel(String(req.params.resource));
  const item = await model.findByPk(String(req.params.id));

  if (!item) {
    throw new AppError('CMS content not found', 404);
  }

  await item.update(normalizePublishedAt(req.body));

  return res.status(200).json({
    success: true,
    message: 'CMS content updated',
    data: item,
  });
}

export async function deleteAdminItem(req: Request, res: Response) {
  const model = getModel(String(req.params.resource));
  const item = await model.findByPk(String(req.params.id));

  if (!item) {
    throw new AppError('CMS content not found', 404);
  }

  await item.destroy();

  return res.status(200).json({
    success: true,
    message: 'CMS content deleted',
  });
}

export async function submitContact(req: Request, res: Response) {
  if (req.body.website) {
    return res.status(201).json({
      success: true,
      message: 'Contact submission received',
    });
  }

  const submission = await ContactSubmission.create({
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject || '',
    message: req.body.message,
  });

  return res.status(201).json({
    success: true,
    message: 'Contact submission received',
    data: submission,
  });
}

export async function getContactSubmissions(_req: Request, res: Response) {
  const submissions = await ContactSubmission.findAll({
    order: [['createdAt', 'DESC']],
  });

  return res.status(200).json({
    success: true,
    data: submissions,
  });
}

export async function updateContactSubmissionStatus(req: Request, res: Response) {
  const submission = await ContactSubmission.findByPk(String(req.params.id));
  const status = req.body.status as 'new' | 'read' | 'archived' | undefined;

  if (!submission) {
    throw new AppError('Contact submission not found', 404);
  }

  if (!status || !['new', 'read', 'archived'].includes(status)) {
    throw new AppError('Valid contact submission status is required', 400);
  }

  await submission.update({ status });

  return res.status(200).json({
    success: true,
    message: 'Contact submission updated',
    data: submission,
  });
}
