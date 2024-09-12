import HttpError from 'http-errors';
import { GetAllData, SortField, SortOrder, Status } from '../types/Global';
import { Op, Order } from 'sequelize';
import { getPagination } from '../utils/helps';
import Tasks from '../models/Tasks';
import * as users from '../services/Users';
import { CreateTaskType, UpdateTaskType } from '../schemas/tasks.schema';
import { FiltersType } from '../schemas/global.schema';
import { TaskStatus } from '../types/Tasks';
import { Users } from '../models';

export const getById = async (id: string): Promise<Tasks> => {
  const data = await Tasks.findByPk(id, {
    include: [
      {
        as: 'reporter',
        model: Users,
        attributes: ['id', 'name', 'email']
      },
      {
        as: 'assigner',
        model: Users,
        attributes: ['id', 'name', 'email']
      }
    ]
  });

  if (!data) throw HttpError(Status.NOT_FOUND, 'Task is not found');

  return data;
};

export const create = async (reporter_id: string, task: CreateTaskType): Promise<Tasks> => {
  await users.getById(task.assignee_id);

  return Tasks.create({ reporter_id, ...task });
};

export const update = async (id: string, task: UpdateTaskType): Promise<Tasks> => {
  const data = await getById(id);

  if (task?.assignee_id) {
    await users.getById(task.assignee_id);
  }

  await data.update({ ...task });

  return data;
};

export const updateStatus = async (id: string, status: TaskStatus): Promise<Tasks> => {
  const data = await getById(id);

  await data.update({ status, ...(status === TaskStatus.DONE && { completed_at: new Date() }) });

  return data;
};

export const getAll = async ({ search, page, size, sortOrder, sortField }: FiltersType) => {
  const order: Order = [[sortField || SortField.CREATED_AT, sortOrder || SortOrder.ASC]];

  const { limit, offset } = getPagination(page, size);

  if (search) search = `%${search.trim().toLowerCase()}%`;

  const data: GetAllData<Tasks> = await Tasks.findAndCountAll({
    distinct: true,
    include: [
      {
        as: 'reporter',
        model: Users,
        attributes: ['id', 'name', 'email']
      },
      {
        as: 'assigner',
        model: Users,
        attributes: ['id', 'name', 'email']
      }
    ],
    where: {
      ...(search && {
        [Op.or]: [{ title: { [Op.iLike]: search } }, { description: { [Op.iLike]: search } }]
      })
    },
    order,
    limit,
    offset
  });

  return { data: data.rows, count: data.count };
};
