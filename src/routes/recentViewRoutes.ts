import { Router } from 'express';
import { getRecentViews } from '../controllers/recentViewController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get(
  '/',
  authMiddleware,
  roleMiddleware(['admin', 'user']),
  asyncHandler(getRecentViews),
);

export default router;
