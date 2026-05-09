import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { Portfolio, User } from '../models';

const publicUser = (user: User, portfolios = 0) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
  portfolios,
});

export async function getProfile(req: Request, res: Response) {
  const user = await User.findByPk(req.user?.id, {
    attributes: ['id', 'name', 'email', 'role', 'status', 'createdAt'],
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  const portfolios = await Portfolio.count({ where: { userId: user.id } });

  return res.status(200).json({
    success: true,
    data: publicUser(user, portfolios),
  });
}

export async function updateProfile(req: Request, res: Response) {
  const user = await User.findByPk(req.user?.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  const { name, email } = req.body as {
    name?: string;
    email?: string;
  };

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }
  }

  await user.update({
    name: name ?? user.name,
    email: email ?? user.email,
  });

  const portfolios = await Portfolio.count({ where: { userId: user.id } });

  return res.status(200).json({
    success: true,
    message: 'Profile updated',
    data: publicUser(user, portfolios),
  });
}

export async function changePassword(req: Request, res: Response) {
  const user = await User.findByPk(req.user?.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  const { currentPassword, newPassword } = req.body as {
    currentPassword?: string;
    newPassword?: string;
  };

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password and new password are required',
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters long',
    });
  }

  const passwordMatches = await bcrypt.compare(currentPassword, user.password);

  if (!passwordMatches) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect',
    });
  }

  await user.update({
    password: await bcrypt.hash(newPassword, 10),
  });

  return res.status(200).json({
    success: true,
    message: 'Password changed',
  });
}
