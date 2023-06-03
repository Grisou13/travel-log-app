import { z } from 'zod';
import type { SomeZodObject, ZodObject } from 'zod';

export const transportTypes = z.enum(['van', 'car', 'plane']);
export type TransportType = z.infer<typeof transportTypes>;

export const mapDiff = (fromType, toType) => {
  const fromKeys = fromType.keyof();
  const toKeys = toType.keyof();
  //TODO find key diffs to see which would be appropriate to fit the description?
  return (data: typeof fromType): typeof toType =>
    Object.entries(data).reduce(
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

export const stringifyDescription = (data: any, validator: any) => {
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
