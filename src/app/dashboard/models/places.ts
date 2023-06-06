import { z } from 'zod';
import { schema as baseSchema } from '@httpClients/travelLogApi/places/schema';

import { validator as baseValidator } from '@httpClients/travelLogApi/places/schema';
import { transportTypes } from './common';

export const validator = baseValidator.omit({ description: true }).merge(
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

export const schema = baseSchema.omit({ description: true }).merge(validator);

export const mapDataToApi = (
  data: z.infer<typeof schema>
): z.infer<typeof baseSchema> => {
  const newObj = Object.entries(data).reduce((acc, [key, value]) => {
    if (!(key in validator)) {
      acc[key] = value;
    }
    return acc;
  }, {} as any);
  return {
    ...data,
    description: JSON.stringify(newObj),
  };
};

export const mapApiToData = (
  data: z.infer<typeof baseSchema>
): z.infer<typeof schema> => {
  const { description, ...raw } = data;
  return {
    ...raw,
    ...JSON.parse(description),
  };
};

export const mapValidatorToApi = (
  data: z.infer<typeof validator>
): z.infer<typeof baseValidator> => {
  const newObj = Object.entries(data).reduce((acc, [key, value]) => {
    if (!(key in validator)) {
      acc[key] = value;
    }
    return acc;
  }, {} as any);
  return {
    ...data,
    description: JSON.stringify(newObj),
  };
};

export type Place = z.infer<typeof schema>;
export type AddPlace = z.infer<typeof validator>;
