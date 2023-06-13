import { z } from 'zod';
import { schema } from '@httpClients/travelLogApi/trips/schema';

import { validator } from '@httpClients/travelLogApi/trips/schema';

export type Trip = z.infer<typeof schema>;
export type AddTrip = z.infer<typeof validator>;
