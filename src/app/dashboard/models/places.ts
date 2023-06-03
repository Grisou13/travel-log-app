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
  type fromType = z.infer<typeof schema>;
  type fromKeys = keyof fromType;

  const fromKeys = schema.keyof();
  const toKeys = baseSchema.keyof();
  return Object.entries(data).reduce(
    (acc, [key, value]) => {
      if (key in fromKeys.Enum) {
        acc[key] = value;
      } else {
        acc['description'][key] = value;
      }
    },
    { description: {} } as any
  );
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
  type fromType = z.infer<typeof validator>;
  type fromKeys = keyof fromType;

  const fromKeys = validator.keyof();
  const toKeys = baseValidator.keyof();
  return Object.entries(data).reduce(
    (acc, [key, value]) => {
      if (key in fromKeys.Enum) {
        acc[key] = value;
      } else {
        acc['description'][key] = value;
      }
    },
    { description: {} } as any
  );
};

export type Place = z.infer<typeof schema>;
export type AddPlace = z.infer<typeof validator>;
