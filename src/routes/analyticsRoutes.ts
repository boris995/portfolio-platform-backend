import { Router } from 'express';
import {
  getAdminAnalytics,
  getUserAnalytics,
} from '../controllers/analyticsController';
import {
  trackPortfolioEvent,
  trackProjectView,
} from '../controllers/analyticsEventController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/me', authMiddleware, roleMiddleware(['admin', 'user']), getUserAnalytics);
router.get('/admin', authMiddleware, roleMiddleware(['admin']), getAdminAnalytics);
router.post('/portfolios/:portfolioId/events', authMiddleware, asyncHandler(trackPortfolioEvent));
router.post('/projects/:projectId/view', authMiddleware, asyncHandler(trackProjectView));

export default router;
