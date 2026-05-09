import type { NextFunction, Request, Response } from 'express';
import type { ZodObject, ZodRawShape } from 'zod';
import {
  cmsContentSchema,
  cmsContentUpdateSchema,
  cmsFaqSchema,
  cmsFaqUpdateSchema,
  cmsServiceSchema,
  cmsServiceUpdateSchema,
} from '../schemas/cmsSchemas';
import AppError from '../utils/AppError';

const createSchemas = {
  pages: cmsContentSchema,
  posts: cmsContentSchema,
  services: cmsServiceSchema,
  faqs: cmsFaqSchema,
} satisfies Record<string, ZodObject<ZodRawShape>>;

const updateSchemas = {
  pages: cmsContentUpdateSchema,
  posts: cmsContentUpdateSchema,
  services: cmsServiceUpdateSchema,
  faqs: cmsFaqUpdateSchema,
} satisfies Record<string, ZodObject<ZodRawShape>>;

const validateCms =
  (schemas: Record<string, ZodObject<ZodRawShape>>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const schema = schemas[String(req.params.resource)];

    if (!schema) {
      return next(new AppError('CMS resource not found', 404));
    }

    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.map(String).join('.')}: ${issue.message}`)
        .join(', ');

      return next(new AppError(message || 'Invalid CMS request body', 400));
    }

    req.body = result.data;
    return next();
  };

export const validateCmsCreate = validateCms(createSchemas);
export const validateCmsUpdate = validateCms(updateSchemas);
