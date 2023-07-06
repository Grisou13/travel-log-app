import { z } from 'zod';
export const transportTypes = z.enum(['van', 'car', 'plane']);
export const transportMethod = z.object({
  transportType: transportTypes,
  pricePerUnit: z.number().default(0),
  unit: z.enum(['km', 'flight', 'trip']),
});
export const dates = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().nullable().optional(),
});
export type TransportType = z.infer<typeof transportTypes>;
export const common = z
  .object({
    transportMethod: transportMethod.optional(),
    budget: z.number().min(0).optional(),
  })
  .merge(dates);
