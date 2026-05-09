import { Router } from 'express';
import {
  createProject,
  getPortfolioProjects,
} from '../controllers/projectController';
import {
  createPortfolio,
  deletePortfolio,
  getMyPortfolio,
  getPortfolioById,
  getPortfolios,
  updatePortfolio,
} from '../controllers/portfolioController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

router.get('/', getPortfolios);
router.get('/me', authMiddleware, getMyPortfolio);
router.get('/:id', getPortfolioById);
router.get('/:portfolioId/projects', getPortfolioProjects);
router.post('/', authMiddleware, roleMiddleware(['admin', 'user']), createPortfolio);
router.post(
  '/:portfolioId/projects',
  authMiddleware,
  roleMiddleware(['admin', 'user']),
  createProject,
);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'user']), updatePortfolio);
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'user']), deletePortfolio);

export default router;
