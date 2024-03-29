import { z } from 'zod';
import { common, commonSchema } from '../common';

export const placeType = z.enum(['PlaceOfInterest', 'TripStop']);

export type PlaceType = z.infer<typeof placeType>;

export const validator = z
  .object({
    name: z.string().min(3).max(100), // "Somewhere",
    description: z.string().min(5).max(50000), //"Over the rainbow",
    order: z.number(), //1 - n order of a place
    directions: z
      .object({
        distance: z.number().optional(),
        previous: z.any().optional(),
        next: z.any().optional(),
      })
      .optional(),
    type: placeType.default('TripStop'),
    location: z.object({
      type: z.enum(['Point']),
      coordinates: z.array(z.number()), // [ 120.5412, -48.1850159 ],
    }),
    infos: z
      .object({
        category_ids: z.any().optional().nullable(),
        relatedToPlace: z.string().optional().nullable(),
        misc_id: z.string().optional().nullable(), //allows us to add another id than the one in the database. This is usefull for pois where they can contain an osm_id
      })
      .optional()
      .nullable(),

    pictureUrl: z.string().optional(), // "https://www.example.com/picture.jpg",
    tripId: z.string(), //"7f063c6e-7717-401a-aa47-34a52f6a45cf",
  })
  .merge(common);

export const schema = z
  .object({
    id: z.string(), // "0860ab21-98e8-4cdd-a407-06d2a50989eb",
    href: z.string(), //"/api/places/0860ab21-98e8-4cdd-a407-06d2a50989eb",
    tripHref: z.string().optional(), // "/api/trips/7f063c6e-7717-401a-aa47-34a52f6a45cf",
  })
  .merge(validator)
  .merge(commonSchema);
export type Place = z.infer<typeof schema>;

export const searchParamsSchema = z
  .object({
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
    include: z.string().optional(),
  })
  .optional();
export type CreatePlace = z.infer<typeof validator>;
export type SearchParams = z.infer<typeof searchParamsSchema>;
