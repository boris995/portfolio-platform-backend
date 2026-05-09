import { Router } from 'express';
import {
  changePassword,
  getProfile,
  updateProfile,
} from '../controllers/userController';
import { getUsers } from '../controllers/adminController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { validateBody } from '../middleware/validate';
import { passwordSchema, profileSchema } from '../schemas/domainSchemas';

const router = Router();

router.use(authMiddleware);

router.get('/me', getProfile);
router.put('/me', validateBody(profileSchema), updateProfile);
router.patch('/me/password', validateBody(passwordSchema), changePassword);
router.get('/', roleMiddleware(['admin']), getUsers);

export default router;
