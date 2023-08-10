import { HttpClient } from '@angular/common/http';
import { from, map, switchMap } from 'rxjs';
import { z } from 'zod';
import {
  Place,
  SearchParams,
  schema,
  searchParamsSchema,
  validator,
} from './schema';

export const fetchAll = (httpClient: HttpClient, data: SearchParams) => {
  return from(searchParamsSchema.parseAsync(data)).pipe(
    switchMap((data) => httpClient.get<Place[]>('/places', { params: data })),
    switchMap((data) => Promise.all(data.map((x) => schema.parseAsync(x))))
    //map((data) => data.map((x) => schema.parse(x)))
  );
};

export const fetchPaginated = (
  httpClient: HttpClient,
  data: SearchParams
) => {};
export const fetchOne = (httpClient: HttpClient, data: Place) => {
  return httpClient
    .get<Place>(`/places/${data.id}`)
    .pipe(switchMap((x) => from(schema.parseAsync(x))));
};
export const fetchById = (httpClient: HttpClient, id: string) => {
  return httpClient
    .get<Place>(`/places/${id}`)
    .pipe(switchMap((x) => from(schema.parseAsync(x))));
};
