import { z } from "zod"


export const validator = z.object({
  "name": z.string().min(1), // "Somewhere",
  "password": z.string().min(1), //"Over the rainbow",
});
export const schema = z.object({
  "createdAt": z.date().optional(),
  "href": z.string(), //"/api/places/0860ab21-98e8-4cdd-a407-06d2a50989eb",
  "id": z.string(), // "0860ab21-98e8-4cdd-a407-06d2a50989eb",
  "pictureUrl": z.string().url(), // "https://www.example.com/picture.jpg",
  "tripsCount": z.number(),
  "updatedAt": z.date().optional(), //"2018-12-09T11:58:18.265Z",
}).merge(validator.omit({"password": true}));


export const searchParamValidator = z.object({
    name: z.string().optional(),
    search: z.string().optional(),
    sort: z.string().optional(),
    href: z.string().optional(),
    id: z.string().optional(),
    page: z.number().optional(),
    pageSize: z.number().optional(),
}).optional();

export type SearchParams = z.infer<typeof searchParamValidator>;


export type User =z.infer<typeof schema>