
import express, { Request, Response } from "express";
import cors from "cors";
import type { ErrorRequestHandler, RequestHandler } from 'express';
import path from 'path';
import adminRoutes from './routes/adminRoutes';
import adminCmsRoutes from './routes/adminCmsRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import authRoutes from './routes/authRoutes';
import cmsRoutes from './routes/cmsRoutes';
import commentRoutes from './routes/commentRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import notificationRoutes from './routes/notificationRoutes';
import portfolioRoutes from './routes/portfolioRoutes';
import projectRoutes from './routes/projectRoutes';
import recentViewRoutes from './routes/recentViewRoutes';
import reportRoutes from './routes/reportRoutes';
import uploadRoutes from './routes/uploadRoutes';
import userRoutes from './routes/userRoutes';
import AppError from './utils/AppError';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL,
].filter((origin): origin is string => Boolean(origin));

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));
app.get("/", (_req: Request, res: Response) => {
  res.send("Backend is live");
});

app.use('/api/auth', authRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/cms', adminCmsRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/recent-views', recentViewRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);

const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  if (error?.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: error.message || 'File upload failed',
    });
  }

  const message = error instanceof Error ? error.message : 'Unknown server error';

  if (process.env.NODE_ENV === 'development') {
    console.error(error);
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? message : undefined,
  });
};

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
