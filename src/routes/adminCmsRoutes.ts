import { Router } from 'express';
import {
  createAdminItem,
  deleteAdminItem,
  getAdminCollection,
  getAdminItem,
  getContactSubmissions,
  updateContactSubmissionStatus,
  updateAdminItem,
  updateAdminItemStatus,
} from '../controllers/cmsController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateCmsCreate, validateCmsUpdate } from '../middleware/cmsValidation';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authMiddleware);

router.get('/contact-submissions', roleMiddleware(['admin']), asyncHandler(getContactSubmissions));
router.patch('/contact-submissions/:id', roleMiddleware(['admin']), asyncHandler(updateContactSubmissionStatus));
router.get('/:resource', roleMiddleware(['admin', 'moderator']), asyncHandler(getAdminCollection));
router.post(
  '/:resource',
  roleMiddleware(['admin', 'moderator']),
  validateCmsCreate,
  asyncHandler(createAdminItem),
);
router.get('/:resource/:id', roleMiddleware(['admin', 'moderator']), asyncHandler(getAdminItem));
router.patch('/:resource/:id/status', roleMiddleware(['admin', 'moderator']), asyncHandler(updateAdminItemStatus));
router.patch(
  '/:resource/:id',
  roleMiddleware(['admin', 'moderator']),
  validateCmsUpdate,
  asyncHandler(updateAdminItem),
);
router.delete(
  '/:resource/:id',
  roleMiddleware(['admin', 'moderator']),
  asyncHandler(deleteAdminItem),
);

export default router;
