import { Router } from 'express';
import {
  createComment,
  deleteComment,
  getPortfolioComments,
} from '../controllers/commentController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { validateBody } from '../middleware/validate';
import { commentSchema } from '../schemas/domainSchemas';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/portfolio/:portfolioId', asyncHandler(getPortfolioComments));
router.post(
  '/portfolio/:portfolioId',
  authMiddleware,
  roleMiddleware(['admin', 'user']),
  validateBody(commentSchema),
  asyncHandler(createComment),
);
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin', 'user']),
  asyncHandler(deleteComment),
);

export default router;
