import { coerce, nativeEnum, object, optional, string, TypeOf } from 'zod';
import { PAGE_LIMIT, SIZE_LIMIT } from '../utils/constants';
import { SortField, SortOrder } from '../types/Global';

export const ParamsId = {
  params: object({
    id: string().uuid()
  }).strict()
};

export const ParamsIdSchema = object({
  ...ParamsId
});

export const Filters = {
  page: coerce.number().min(1).max(100).default(PAGE_LIMIT),
  size: coerce.number().min(1).max(100).default(SIZE_LIMIT),
  search: string().min(2).optional(),
  sortOrder: optional(nativeEnum(SortOrder).default(SortOrder.DESC)),
  sortField: optional(nativeEnum(SortField).default(SortField.UPDATED_AT))
};

export const FiltersSchema = object({ query: object(Filters).strict() });

export type ParamsIdType = TypeOf<typeof ParamsIdSchema>['params'];

export type FiltersType = TypeOf<typeof FiltersSchema>['query'];
