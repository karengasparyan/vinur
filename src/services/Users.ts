import { Users } from '../models';
import HttpError from 'http-errors';
import { Status } from '../types/Global';
import { ChangePasswordType, UpdateInfoType } from '../schemas/users.schema';
import { redisClient } from '../options/Redis';
import { hashedPassword } from '../utils/helps';

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

  await redisClient.del(`users:${user_id}:verificationToken`);

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
