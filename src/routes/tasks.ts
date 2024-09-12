import { Router } from 'express';
import TasksController from '../controllers/TasksController';
import AuthorizationMiddleware from '../middlewares/authorization.middleware';
import ValidationMiddleware from '../middlewares/validation.middleware';
import { FiltersSchema, ParamsIdSchema } from '../schemas/global.schema';
import { TaskCreateSchema, TaskUpdateSchema, TaskUpdateStatusSchema } from '../schemas/tasks.schema';

const router = Router();

router.use(AuthorizationMiddleware());

router.get('/', ValidationMiddleware(FiltersSchema), TasksController.GetAll);

router.post('/', ValidationMiddleware(TaskCreateSchema), TasksController.Create);

router.put('/:id', ValidationMiddleware(TaskUpdateSchema), TasksController.Update);

router.patch('/:id', ValidationMiddleware(TaskUpdateStatusSchema), TasksController.UpdateStatus);

router.get('/:id', ValidationMiddleware(ParamsIdSchema), TasksController.GetById);

export default router;
