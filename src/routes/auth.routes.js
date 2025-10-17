import { signin, signout, signup } from '#controllers/auth.controller.js';
import { Router } from 'express';

const router = Router();

router.post('/sign-up', signup);
router.post('/sign-in', signin);
router.post('/sign-out', signout);

export default router;
