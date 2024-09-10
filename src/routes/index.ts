import { Router } from 'express';

import auth from './auth';

import user from './users';

import tasks from './tasks';

const router = Router();

router.use('/auth', auth);

router.use('/users', user);

router.use('/tasks', tasks);

export default router;
