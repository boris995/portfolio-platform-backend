import { Router } from 'express';
import {
  createReport,
  deleteReport,
  getReports,
  resolveReport,
} from '../controllers/reportController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { validateBody } from '../middleware/validate';
import { reportSchema } from '../schemas/domainSchemas';

const router = Router();

router.post('/', authMiddleware, roleMiddleware(['admin', 'user']), validateBody(reportSchema), createReport);
router.get('/', authMiddleware, roleMiddleware(['admin']), getReports);
router.patch(
  '/:id/resolve',
  authMiddleware,
  roleMiddleware(['admin']),
  resolveReport,
);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteReport);

export default router;
