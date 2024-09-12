import { nativeEnum, object, string, coerce, TypeOf } from 'zod';
import { ParamsId } from './global.schema';
import { TaskPriority, TaskStatus } from '../types/Tasks';

export const TaskCreateSchema = object({
  body: object({
    assignee_id: string().uuid(),
    title: string().min(3).max(128),
    description: string().max(512).nullable().optional(),
    priority: nativeEnum(TaskPriority).optional().default(TaskPriority.MEDIUM),
    due_date: coerce.date() // ISO date format (YYYY-MM-DD)
  }).strict()
});

export const TaskUpdateSchema = object({
  ...ParamsId,
  body: object({
    assignee_id: string().uuid().optional(),
    title: string().min(3).max(128).optional(),
    description: string().max(512).nullable().optional(),
    priority: nativeEnum(TaskPriority).default(TaskPriority.MEDIUM).optional(),
    due_date: coerce.date().optional() // ISO date format (YYYY-MM-DD)
  }).strict()
});

export const TaskUpdateStatusSchema = object({
  ...ParamsId,
  body: object({
    status: nativeEnum(TaskStatus)
  }).strict()
});

export type CreateTaskType = TypeOf<typeof TaskCreateSchema>['body'];

export type UpdateTaskType = TypeOf<typeof TaskUpdateSchema>['body'];

export type UpdateTaskStatusType = TypeOf<typeof TaskUpdateStatusSchema>['body'];
