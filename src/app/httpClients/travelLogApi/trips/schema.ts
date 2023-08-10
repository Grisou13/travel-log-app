import { common, commonSchema, transportMethod } from './../common';
import { z } from 'zod';
import { schema as placeSchema } from '../places/schema';
export const validator = z
  .object({
    title: z.string().min(3).max(100), // "Somewhere",
    description: z.string().min(5).max(50000), //"Over the rainbow",
    totalDistance: z.number().optional(),
  })
  .merge(common);
export const schema = z
  .object({
    href: z.string(), //"/api/places/0860ab21-98e8-4cdd-a407-06d2a50989eb",
    id: z.string(), // "0860ab21-98e8-4cdd-a407-06d2a50989eb",
    placesCount: z.number().optional(),
    userHref: z.string().optional(), //"/api/users/d68cf4e9-1349-4d45-b356-c1294e49ef23",
    userId: z.string(), //"d68cf4e9-1349-4d45-b356-c1294e49ef23"
  })
  .merge(validator)
  .merge(commonSchema);

export const searchParamValidator = z
  .object({
    user: z.string().optional(),
    title: z.string().optional(),
    search: z.string().optional(),
    sort: z.string().optional(),
    href: z.string().optional(),
    id: z.string().optional(),
    page: z.number().optional(),
    pageSize: z.number().optional(),
    include: z.string().optional(),
  })
  .optional();

export type SearchParams = z.infer<typeof searchParamValidator>;

export type CreateTrip = z.infer<typeof validator>;
export type Trip = z.infer<typeof schema>;
