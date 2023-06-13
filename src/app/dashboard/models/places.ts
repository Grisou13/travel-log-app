import { z } from 'zod';
import { schema } from '@httpClients/travelLogApi/places/schema';

import { validator } from '@httpClients/travelLogApi/places/schema';

export type Place = z.infer<typeof schema>;
export type AddPlace = z.infer<typeof validator>;
