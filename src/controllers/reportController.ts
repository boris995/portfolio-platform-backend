import type { Request, Response } from 'express';
import { Portfolio, Report, User } from '../models';
import type { ReportStatus } from '../models/Report';

type ReportBody = {
  portfolioId?: number;
  reason?: string;
  details?: string;
};

const reportIncludes = [
  {
    model: Portfolio,
    as: 'portfolio',
    attributes: ['id', 'title', 'slug', 'status', 'featured'],
  },
  {
    model: User,
    as: 'reporter',
    attributes: ['id', 'name', 'email'],
  },
];

export async function createReport(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication is required',
    });
  }

  const body = req.body as ReportBody;

  if (!body.portfolioId || !body.reason) {
    return res.status(400).json({
      success: false,
      message: 'Portfolio and reason are required',
    });
  }

  const portfolio = await Portfolio.findByPk(body.portfolioId);

  if (!portfolio) {
    return res.status(404).json({
      success: false,
      message: 'Portfolio not found',
    });
  }

  const report = await Report.create({
    portfolioId: portfolio.id,
    reporterId: req.user.id,
    reason: body.reason,
    details: body.details || '',
  });

  const createdReport = await Report.findByPk(report.id, {
    include: reportIncludes,
  });

  return res.status(201).json({
    success: true,
    message: 'Report submitted',
    data: createdReport,
  });
}

export async function getReports(req: Request, res: Response) {
  const status = req.query.status as ReportStatus | undefined;

  const reports = await Report.findAll({
    where: status === 'open' || status === 'resolved' ? { status } : undefined,
    include: reportIncludes,
    order: [['createdAt', 'DESC']],
  });

  return res.status(200).json({
    success: true,
    data: reports,
  });
}

export async function resolveReport(req: Request, res: Response) {
  const report = await Report.findByPk(String(req.params.id), {
    include: reportIncludes,
  });

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found',
    });
  }

  await report.update({
    status: 'resolved',
    resolvedAt: new Date(),
  });

  return res.status(200).json({
    success: true,
    message: 'Report resolved',
    data: report,
  });
}

export async function deleteReport(req: Request, res: Response) {
  const report = await Report.findByPk(String(req.params.id));

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found',
    });
  }

  await report.destroy();

  return res.status(200).json({
    success: true,
    message: 'Report deleted',
  });
}
