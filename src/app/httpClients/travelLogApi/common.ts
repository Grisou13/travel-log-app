import { z } from 'zod';
export const transportTypes = z.enum(['van', 'car', 'plane']);
export const transportMethod = z.object({
  transportType: transportTypes,
  pricePerUnit: z.number().default(0),
  unit: z.enum(['km', 'flight', 'trip']),
});
export const dates = z.object({
  startDate: z
    .date()
    .optional()
    .default(() => new Date()),
  endDate: z.date().optional(),
});
export type TransportType = z.infer<typeof transportTypes>;
export const common = z
  .object({
    transportMethod: transportMethod.optional(),
    budget: z.number().min(0).optional(),
  })
  .merge(dates);
