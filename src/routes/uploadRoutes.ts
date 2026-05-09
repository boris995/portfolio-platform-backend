import { Router } from 'express';
import { uploadSingleImage } from '../controllers/uploadController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { upload } from '../middleware/uploadMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authMiddleware, roleMiddleware(['admin', 'user']));

router.post('/avatar', upload.single('avatar'), asyncHandler(uploadSingleImage));
router.post('/cover', upload.single('cover'), asyncHandler(uploadSingleImage));
router.post('/project', upload.single('project'), asyncHandler(uploadSingleImage));

export default router;
