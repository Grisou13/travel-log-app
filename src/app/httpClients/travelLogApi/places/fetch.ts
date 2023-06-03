import { HttpClient } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { z } from 'zod';
import { Place, SearchParams, searchParamsSchema, validator } from './schema';

export const fetchAll = (httpClient: HttpClient, data: SearchParams) => {
  return from(searchParamsSchema.parseAsync(data)).pipe(
    switchMap((data) => httpClient.get<Place[]>('/places', { params: data }))
  );
};

export const fetchPaginated = (
  httpClient: HttpClient,
  data: SearchParams
) => {};
export const fetchOne = (httpClient: HttpClient, data: Place) => {
  return httpClient.get<Place>(`/places/${data.id}`);
};
export const fetchById = (httpClient: HttpClient, id: string) => {
  return httpClient.get<Place>(`/places/${id}`);
};
