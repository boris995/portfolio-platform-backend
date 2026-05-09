import type { Request, Response } from 'express';
import { toPublicUploadUrl } from '../middleware/uploadMiddleware';
import AppError from '../utils/AppError';

export async function uploadSingleImage(req: Request, res: Response) {
  const file = req.file;

  if (!file) {
    throw new AppError('Image file is required', 400);
  }

  return res.status(201).json({
    success: true,
    data: {
      url: toPublicUploadUrl(file),
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
    },
  });
}
