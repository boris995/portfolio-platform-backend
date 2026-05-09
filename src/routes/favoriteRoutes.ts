import { Router } from 'express';
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from '../controllers/favoriteController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authMiddleware, roleMiddleware(['admin', 'user']));

router.get('/', asyncHandler(getFavorites));
router.post('/:portfolioId', asyncHandler(addFavorite));
router.delete('/:portfolioId', asyncHandler(removeFavorite));

export default router;
