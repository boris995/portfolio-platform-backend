import { Router } from 'express';
import {
  approvePortfolio,
  blockUser,
  featurePortfolio,
  getUsers,
  rejectPortfolio,
} from '../controllers/adminController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware, roleMiddleware(['admin']));

router.patch('/portfolios/:id/approve', approvePortfolio);
router.patch('/portfolios/:id/reject', rejectPortfolio);
router.patch('/portfolios/:id/feature', featurePortfolio);
router.get('/users', getUsers);
router.patch('/users/:id/block', blockUser);

export default router;
