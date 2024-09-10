import HttpError from 'http-errors';
import { GetAllData, SortField, SortOrder, Status } from '../types/Global';
import { Op, Order, Sequelize } from 'sequelize';
import { getPagination } from '../utils/helps';
import Tasks from '../models/Tasks';
import { CreateTaskType, UpdateTaskType } from '../schemas/tasks.schema';
import { FiltersType } from '../schemas/global.schema';
import { Users } from '../models';
import { TaskStatus } from '../types/Tasks';

export const getById = async (id: string): Promise<Tasks> => {
  const data = await Tasks.findByPk(id);

  if (!data) throw HttpError(Status.NOT_FOUND, 'Task is not found');

  return data;
};

export const create = async (reporter_id: string, task: CreateTaskType): Promise<Tasks> => {
  return Tasks.create({ reporter_id, ...task });
};

export const update = async (id: string, task: UpdateTaskType): Promise<Tasks> => {
  const data = await getById(id);

  await data.update({ ...task });

  return data;
};

export const getAll = async ({ search, page, size, sortOrder, sortField }: FiltersType) => {
  const order: Order = [[sortField || SortField.CREATED_AT, sortOrder || SortOrder.ASC]];

  const { limit, offset } = getPagination(page, size);

  if (search) search = `%${search.trim().toLowerCase()}%`;

  const data: GetAllData<Tasks> = await Tasks.findAndCountAll({
    distinct: true,
    where: {
      ...(search && {
        [Op.or]: [{ title: { [Op.iLike]: search } }, { description: { [Op.iLike]: search } }]
      })
    },
    order,
    limit,
    offset
  });

  const statics = await Users.findAll({
    attributes: [
      'id',
      'name',
      [
        Sequelize.literal(`(SELECT COALESCE(CAST(FLOOR(AVG(time_tracking)) AS INTEGER), 0) FROM tasks WHERE assignee_id = "Users"."id")`),
        'average_time_tracking'
      ],
      [Sequelize.literal(`(SELECT COALESCE(MAX(time_tracking), 0) FROM tasks WHERE assignee_id = "Users"."id")`), 'maximum_time_tracking'],
      [Sequelize.literal(`(SELECT COALESCE(MIN(time_tracking), 0) FROM tasks WHERE assignee_id = "Users"."id")`), 'minimum_time_tracking'],
      [
        Sequelize.literal(`(SELECT COALESCE(CAST(COUNT(*) AS INTEGER), 0) FROM tasks WHERE assignee_id = "Users"."id" AND status = :status)`),
        'success_count'
      ]
    ],
    replacements: { status: TaskStatus.DONE }
  });

  return { data: data.rows, count: data.count, statics };
};
