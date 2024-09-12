import { Users } from '../models';

export enum NodeEnv {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  STAGING = 'staging'
}

export enum Status {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  LOCKED = 423,
  INTERNAL_SERVER_ERROR = 500
}

export enum Success {
  OK = 'ok',
  FAIL = 'fail',
  ERROR = 'error'
}

export interface RedisData {
  accessToken: string;
  refreshToken: string;
  verificationToken: string;
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}
export enum ReportOperator {
  AVG = 'AVG',
  MAX = 'MAX',
  MIN = 'MIN'
}

export enum SortField {
  TITLE = 'title',
  NAME = 'name',
  EMAIL = 'email',
  DESCRIPTION = 'description',
  DUE_DATE = 'due_date',
  PRIORITY = 'priority',
  STATUS = 'status',
  COMPLETED_AT = 'completed_at',
  AVERAGE_COMPLETED_AT = 'average_completed_at',
  MAXIMUM_COMPLETED_AT = 'maximum_completed_at',
  MINIMUM_COMPLETED_AT = 'minimum_completed_at',
  SUCCESS_COUNT = 'success_count',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at'
}

declare global {
  namespace Express {
    interface Request {
      user_id: string;
      user: Users;
    }
  }
}

export interface GetAllData<T> {
  rows: T[];
  count: number;
}
