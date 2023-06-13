import { z } from 'zod';
import { schema } from '@httpClients/travelLogApi/trips/schema';

import { validator } from '@httpClients/travelLogApi/trips/schema';
import { Place } from './places';
export type Trip = z.infer<typeof schema> & {
  places: Place[];
};
export type AddTrip = z.infer<typeof validator> & {
  places: Place[];
};
