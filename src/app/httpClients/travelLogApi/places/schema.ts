import { z } from "zod"

export const validator = z.object({
  "name": z.string().min(1), // "Somewhere",
  "description": z.string(), //"Over the rainbow",
  "location": z.object({
    "type": z.enum(["Point", "LineString", "Polygon", "MultiPoint", "MultiLineString", "MultiPolygon"]),
    "coordinates": z.array(z.number()) // [ 120.5412, -48.1850159 ],
  }),
  "pictureUrl": z.string().url(), // "https://www.example.com/picture.jpg",
  "tripHref": z.string().optional(), // "/api/trips/7f063c6e-7717-401a-aa47-34a52f6a45cf",
  "tripId": z.string().optional() //"7f063c6e-7717-401a-aa47-34a52f6a45cf",
})

export const schema = z.object({
  
  "id": z.string(), // "0860ab21-98e8-4cdd-a407-06d2a50989eb",
  "href": z.string(), //"/api/places/0860ab21-98e8-4cdd-a407-06d2a50989eb",
  "updatedAt": z.date().optional(),
  "createdAt": z.date().optional(),
}).merge(validator)
export type Place =z.infer<typeof schema>

export const searchParamsSchema = z.object({
    trip: z.string().optional(),
    name: z.string().optional(),
    search: z.string().optional(),
    bbox: z.string().optional(),
    near: z.string().optional(),
    sort: z.string().optional(),
    href: z.string().optional(),
    id: z.string().optional(),
    page: z.number().optional(),
    pageSize: z.number().optional(),
    include: z.string().optional()
}).optional();

export type SearchParams = z.infer<typeof validator>;