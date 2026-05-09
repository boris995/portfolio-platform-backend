import { Router } from 'express';
import {
  deleteProject,
  updateProject,
} from '../controllers/projectController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { validateBody } from '../middleware/validate';
import { projectSchema } from '../schemas/domainSchemas';

const router = Router();

router.put('/:id', authMiddleware, roleMiddleware(['admin', 'user']), validateBody(projectSchema), updateProject);
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'user']), deleteProject);

export default router;
