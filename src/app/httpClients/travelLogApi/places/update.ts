import { HttpClient } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { Place, schema, validator } from './schema';

export const update = (httpClient: HttpClient, data: Place) => {
  return from(schema.parseAsync(data)).pipe(
    switchMap((data) => httpClient.patch<Place>(`/places/${data.id}`, data)),
    switchMap((x) => from(schema.parseAsync(x)))
  );
};
