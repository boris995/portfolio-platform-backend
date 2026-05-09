import { Router } from 'express';
import {
  createAdminItem,
  deleteAdminItem,
  getAdminCollection,
  getAdminItem,
  getContactSubmissions,
  updateContactSubmissionStatus,
  updateAdminItem,
} from '../controllers/cmsController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateCmsCreate, validateCmsUpdate } from '../middleware/cmsValidation';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authMiddleware, roleMiddleware(['admin']));

router.get('/contact-submissions', asyncHandler(getContactSubmissions));
router.patch('/contact-submissions/:id', asyncHandler(updateContactSubmissionStatus));
router.get('/:resource', asyncHandler(getAdminCollection));
router.post(
  '/:resource',
  validateCmsCreate,
  asyncHandler(createAdminItem),
);
router.get('/:resource/:id', asyncHandler(getAdminItem));
router.patch(
  '/:resource/:id',
  validateCmsUpdate,
  asyncHandler(updateAdminItem),
);
router.delete(
  '/:resource/:id',
  asyncHandler(deleteAdminItem),
);

export default router;
