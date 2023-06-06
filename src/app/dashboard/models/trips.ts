import { z } from 'zod';
import { schema as baseSchema } from '@httpClients/travelLogApi/trips/schema';

import { validator as baseValidator } from '@httpClients/travelLogApi/trips/schema';

export const validator = baseValidator.omit({ description: true }).merge(
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
  // type fromType = z.infer<typeof validator>;
  // type toType = z.infer<typeof baseValidator>;
  // const fromKeys = validator.keyof();
  // const toKeys = baseValidator.keyof();
  // const authorizedKeys = Object.keys(fromKeys.Enum);
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

export type Trip = z.infer<typeof schema>;
export type AddTrip = z.infer<typeof validator>;
