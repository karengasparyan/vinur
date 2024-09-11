import { Users } from '../models';
import HttpError from 'http-errors';
import { GetAllData, SortField, SortOrder, Status } from '../types/Global';
import { ChangePasswordType, UpdateInfoType } from '../schemas/users.schema';
import { Redis } from '../options/Redis';
import { getPagination, hashedPassword } from '../utils/helps';
import { Op, Order, Sequelize } from 'sequelize';
import { TaskStatus } from '../types/Tasks';
import { FiltersType } from '../schemas/global.schema';

export const getById = async (id: string): Promise<Users> => {
  const data: Users | null = await Users.findOne({
    where: { id }
  });

  if (!data) throw HttpError(Status.NOT_FOUND, 'User is not found');

  return data;
};

export const updateInfo = async (user_id: string, payload: UpdateInfoType): Promise<Users> => {
  const { name } = payload;

  const user = await getById(user_id);

  await user.update({ name });

  return user;
};

export const destroy = async (user_id: string): Promise<void> => {
  const user = await getById(user_id);

  await Redis.getClient().del(`users:${user_id}:verificationToken`);

  return user.destroy();
};

export const changePassword = async (id: string, { password, oldPassword }: ChangePasswordType): Promise<boolean> => {
  const user = await Users.findOne({
    where: {
      id,
      password: hashedPassword(oldPassword)
    }
  });

  if (!user) {
    throw HttpError(Status.BAD_REQUEST, 'Change password is fail');
  }

  await user.update({ password });

  return true;
};

export const report = async ({ search, page, size, sortOrder, sortField }: FiltersType) => {
  const order: Order = [[sortField || SortField.CREATED_AT, sortOrder || SortOrder.ASC]];

  const { limit, offset } = getPagination(page, size);

  if (search) search = `%${search.trim().toLowerCase()}%`;

  const data: GetAllData<Users> = await Users.findAndCountAll({
    distinct: true,
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
    where: {
      ...(search && {
        [Op.or]: [{ name: { [Op.iLike]: search } }, { email: { [Op.iLike]: search } }]
      })
    },
    order,
    limit,
    offset,
    replacements: { status: TaskStatus.DONE }
  });

  return { data: data.rows, count: data.count };
};
