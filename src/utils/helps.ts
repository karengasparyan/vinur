import sha256 from 'crypto-js/sha256';
import { decode, sign, verify } from 'jsonwebtoken';
import { JWT_SECRET_ACCESS, JWT_SECRET_REFRESH, USER_PASSWORD_SECRET } from '../config/config';
import { SIZE_LIMIT } from './constants';
import { Redis } from '../options/Redis';
import { Users } from '../models';
import { ReportOperator } from '../types/Global';
import { Sequelize } from 'sequelize';

export const hashedPassword = (password: string): string => {
  return sha256(sha256(password).toString() + USER_PASSWORD_SECRET).toString();
};

export const generateToken = async (user: Users | {}, jwtSecret: string, expiresIn: string) => {
  return sign({ user }, jwtSecret, { expiresIn });
};

export const validateToken = async (token: string, jwtSecret: string): Promise<{ user: Users }> => {
  return verify(token, jwtSecret) as { user: Users };
};

export const decodeToken = async (token: string) => {
  return decode(token) as { user: Users };
};

export const getPagination = (page?: number, size?: number) => {
  const limit = size ? +size : SIZE_LIMIT;

  const offset = page ? (+page - 1) * limit : 0;

  return { limit, offset };
};

export const jwtError = (error: string) => {
  switch (error) {
    case 'TokenExpiredError':
      return 'Token has expired';
    case 'JsonWebTokenError':
      return 'Invalid token or signature';
    default:
      return 'Token error';
  }
};

export const corsOptions = {
  origin: ['https://vinur.info'],
  credentials: true
};

export const getTokens = async (user: Users): Promise<{ accessToken: string; refreshToken: string }> => {
  const accessToken: string = await generateToken(user, JWT_SECRET_ACCESS as string, '8h');

  const refreshToken: string = await generateToken(user, JWT_SECRET_REFRESH as string, '72h');

  await Redis.getClient().set(`users:${user.id}:accessToken`, accessToken);

  await Redis.getClient().set(`users:${user.id}:refreshToken`, refreshToken);

  return { accessToken, refreshToken };
};

export const getReportDynamicQuery = (operator: ReportOperator) => {
  return Sequelize.literal(`(SELECT COALESCE(TO_CHAR(INTERVAL '1 second' * ${operator}(EXTRACT(EPOCH FROM completed_at - created_at)), CONCAT('HH24:MI', ' hour')), '00:00 hour')
            FROM tasks 
          WHERE assignee_id = "Users"."id" 
            AND completed_at IS NOT NULL 
            AND created_at IS NOT NULL)`);
};
