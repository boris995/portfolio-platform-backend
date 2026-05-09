import type { Request, Response } from 'express';
import { Notification } from '../models';
import AppError from '../utils/AppError';

export async function getNotifications(req: Request, res: Response) {
  const notifications = await Notification.findAll({
    where: { userId: req.user?.id },
    order: [['createdAt', 'DESC']],
    limit: 50,
  });

  return res.status(200).json({
    success: true,
    data: {
      items: notifications,
      unreadCount: notifications.filter((notification) => !notification.readAt)
        .length,
    },
  });
}

export async function markNotificationRead(req: Request, res: Response) {
  const notification = await Notification.findOne({
    where: { id: req.params.id, userId: req.user?.id },
  });

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  await notification.update({ readAt: new Date() });

  return res.status(200).json({
    success: true,
    data: notification,
  });
}

export async function markAllNotificationsRead(req: Request, res: Response) {
  await Notification.update(
    { readAt: new Date() },
    { where: { userId: req.user?.id, readAt: null } },
  );

  return res.status(200).json({
    success: true,
    message: 'Notifications marked as read',
  });
}
