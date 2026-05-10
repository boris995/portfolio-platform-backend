import { Router } from 'express';
import {
  getPublicBySlug,
  getPublicCollection,
  getRelatedPublicContent,
  submitContact,
} from '../controllers/cmsController';
import { validateBody } from '../middleware/validate';
import { contactSubmissionSchema } from '../schemas/cmsSchemas';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/contact', validateBody(contactSubmissionSchema), asyncHandler(submitContact));
router.get('/:resource', asyncHandler(getPublicCollection));
router.get('/:resource/:slug/related', asyncHandler(getRelatedPublicContent));
router.get('/:resource/:slug', asyncHandler(getPublicBySlug));

export default router;
