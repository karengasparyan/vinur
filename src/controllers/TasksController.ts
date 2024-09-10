import { Request, Response, NextFunction } from 'express';
import { Status, Success } from '../types/Global';
import * as tasks from '../services/Tasks';
import { FiltersType, ParamsIdType } from '../schemas/global.schema';
import { CreateTaskType, UpdateTaskType } from '../schemas/tasks.schema';

export default class TasksController {
  static Create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { user_id } = req;

      const payload = req.body as CreateTaskType;

      const data = await tasks.create(user_id, payload);

      return res.status(Status.OK).json({
        success: Success.OK,
        message: 'Task create successfully',
        data
      });
    } catch (e) {
      return next(e);
    }
  };

  static Update = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = req.params as ParamsIdType;

      const payload = req.body as UpdateTaskType;

      const data = await tasks.update(id, payload);

      return res.status(Status.OK).json({
        success: Success.OK,
        message: 'Task update successfully',
        data
      });
    } catch (e) {
      return next(e);
    }
  };

  static GetById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = req.params as ParamsIdType;

      const data = await tasks.getById(id);

      return res.status(Status.OK).json({
        success: Success.OK,
        message: 'Task',
        data
      });
    } catch (e) {
      return next(e);
    }
  };

  static GetAll = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const payload = req.query as unknown as FiltersType;

      const data = await tasks.getAll(payload);

      return res.status(Status.OK).json({
        success: Success.OK,
        message: 'Tasks list',
        ...data
      });
    } catch (e) {
      return next(e);
    }
  };
}
