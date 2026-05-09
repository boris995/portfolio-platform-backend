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
import { authMiddleware, optionalAuthMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { validateBody } from '../middleware/validate';
import { createPortfolioSchema, createProjectSchema, portfolioSchema } from '../schemas/domainSchemas';

const router = Router();

router.get('/', getPortfolios);
router.get('/me', authMiddleware, getMyPortfolio);
router.get('/:id', optionalAuthMiddleware, getPortfolioById);
router.get('/:portfolioId/projects', getPortfolioProjects);
router.post('/', authMiddleware, roleMiddleware(['admin', 'user']), validateBody(createPortfolioSchema), createPortfolio);
router.post(
  '/:portfolioId/projects',
  authMiddleware,
  roleMiddleware(['admin', 'user']),
  validateBody(createProjectSchema),
  createProject,
);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'user']), validateBody(portfolioSchema), updatePortfolio);
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'user']), deletePortfolio);

export default router;
