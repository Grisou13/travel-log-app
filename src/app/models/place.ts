import { z } from 'zod';
import { schema as baseSchema } from '../httpClients/travelLogApi/places/schema';
import { transportTypes } from './common';

export { validator } from '../httpClients/travelLogApi/places/schema';
export const schema = baseSchema.omit({ description: true }).merge(
  z.object({
    startDate: z.date(),
    endDate: z.date(),
    budget: z.number().min(0),
    totalDistance: z.number(),
    transportMethod: z.object({
      transportType: transportTypes,
      price: z.number(),
    }),
    type: z.enum(['PlaceOfInterest', 'TripStop']),
  })
);

export type Place = z.infer<typeof schema>;
