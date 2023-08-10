import { HttpClient } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { z } from 'zod';
import { CreatePlace, Place, schema, validator } from './schema';

export const create = (httpClient: HttpClient, data: CreatePlace) => {
  return from(validator.parseAsync(data)).pipe(
    switchMap((data) => httpClient.post<Place>('/places', data)),
    switchMap((x) => from(schema.parseAsync(x)))
  );
};
