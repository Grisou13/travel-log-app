import { HttpClient } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { z } from 'zod';
import { CreateTrip, Trip, validator } from './schema';

export const create = (httpClient: HttpClient, data: CreateTrip) => {
  return from(validator.parseAsync(data)).pipe(
    switchMap((data) => httpClient.post<Trip>('/trips', data))
  );
};
