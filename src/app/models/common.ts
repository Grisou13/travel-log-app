import { z } from 'zod';

export const transportTypes = z.enum(['van', 'car', 'plane']);
export type TransportType = z.infer<typeof transportTypes>;
