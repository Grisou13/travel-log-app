import { z } from 'zod';

export const validator = z.object({
  title: z.string().min(1), // "Somewhere",
  description: z.string(), //"Over the rainbow",
});
export const schema = z
  .object({
    createdAt: z.date().optional(),
    href: z.string(), //"/api/places/0860ab21-98e8-4cdd-a407-06d2a50989eb",
    id: z.string(), // "0860ab21-98e8-4cdd-a407-06d2a50989eb",
    pictureUrl: z.string().url(), // "https://www.example.com/picture.jpg",
    tripHref: z.string().optional(), // "/api/trips/7f063c6e-7717-401a-aa47-34a52f6a45cf",
    tripId: z.string().optional(), //"7f063c6e-7717-401a-aa47-34a52f6a45cf",
    placesCount: z.number(),
    updatedAt: z.date().optional(), //"2018-12-09T11:58:18.265Z",
    userHref: z.string().optional(), //"/api/users/d68cf4e9-1349-4d45-b356-c1294e49ef23",
    userId: z.string().optional(), //"d68cf4e9-1349-4d45-b356-c1294e49ef23"
  })
  .merge(validator);

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
