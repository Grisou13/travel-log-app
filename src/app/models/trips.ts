import { z } from 'zod';
import { schema as baseSchema } from '../httpClients/travelLogApi/trips/schema';

export { validator } from '../httpClients/travelLogApi/trips/schema';
export const schema = baseSchema.omit({ description: true }).merge(
  z.object({
    startDate: z.date(),
    endDate: z.date(),
    budget: z.number().min(0),
    totalDistance: z.number(),
    transportMethod: z.object({
      transportType: z.enum(['van', 'car', 'plane']),
      price: z.number(),
    }),
  })
);

export type Trip = z.infer<typeof schema>;
