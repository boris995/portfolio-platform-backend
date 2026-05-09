import fs from 'fs';
import path from 'path';
// import multer from 'multer';
import type { Request } from 'express';
import AppError from '../utils/AppError';

type MulterFile = Express.Multer.File;

const maxFileSize = 3 * 1024 * 1024;
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
const uploadRoot = path.resolve(process.cwd(), 'uploads');

const folders = {
  avatar: 'avatars',
  cover: 'covers',
  project: 'projects',
} as const;

type UploadTarget = keyof typeof folders;

Object.values(folders).forEach((folder) => {
  fs.mkdirSync(path.join(uploadRoot, folder), { recursive: true });
});

const storage = multer.diskStorage({
  destination: (_req: Request, file: MulterFile, callback) => {
    const field = file.fieldname as UploadTarget;
    const folder = folders[field] || folders.project;
    callback(null, path.join(uploadRoot, folder));
  },
  filename: (_req: Request, file: MulterFile, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    callback(null, safeName);
  },
});

const fileFilter = (
  _req: Request,
  file: MulterFile,
  callback: multer.FileFilterCallback,
) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    callback(new AppError('Only jpg, png and webp images are allowed', 400));
    return;
  }

  callback(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSize,
  },
});

export const toPublicUploadUrl = (file?: MulterFile) => {
  if (!file) {
    return undefined;
  }

  const relativePath = path
    .relative(uploadRoot, file.path)
    .split(path.sep)
    .join('/');

  return `/uploads/${relativePath}`;
};