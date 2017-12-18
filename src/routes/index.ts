import { Router } from 'express';
import { index } from '../controllers/home';

const router: Router = Router();

/**
 * Controllers (route handlers).
 */

router.get('/', index);

export default router;
