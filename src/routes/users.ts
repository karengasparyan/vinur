import { Router } from 'express';
import UsersController from '../controllers/UsersController';
import AuthorizationMiddleware from '../middlewares/authorization.middleware';
import ValidationMiddleware from '../middlewares/validation.middleware';
import { ChangePasswordSchema, UpdateInfoSchema } from '../schemas/users.schema';
import { FiltersSchema } from '../schemas/global.schema';

const router = Router();

router.use(AuthorizationMiddleware());

router.put('/', ValidationMiddleware(UpdateInfoSchema), UsersController.UpdateInfo);

router.delete('/', UsersController.Destroy);

router.get('/me', UsersController.Me);

router.get('/report', ValidationMiddleware(FiltersSchema), UsersController.Report);

router.put('/change-password', ValidationMiddleware(ChangePasswordSchema), UsersController.ChangePassword);

export default router;
