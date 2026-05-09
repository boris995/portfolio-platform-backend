import { Router } from 'express';
import {
  deleteProject,
  updateProject,
} from '../controllers/projectController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

router.put('/:id', authMiddleware, roleMiddleware(['admin', 'user']), updateProject);
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'user']), deleteProject);

export default router;
