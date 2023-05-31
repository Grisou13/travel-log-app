import { HttpClient } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { z } from 'zod';
import {
  SearchParams,
  Trip,
  schema,
  searchParamValidator,
  validator,
} from './schema';

export const fetchAll = (httpClient: HttpClient, data: SearchParams) => {
  return from(searchParamValidator.parseAsync(data)).pipe(
    switchMap((data) => httpClient.get<Trip[]>('/trips', { params: data }))
  );
};

export const fetchByUser = (
  httpClient: HttpClient,
  userId: string,
  data: SearchParams
) => {
  return from(searchParamValidator.parseAsync({ user: userId, ...data })).pipe(
    switchMap((data) => httpClient.get<Trip[]>('/trips', { params: data }))
  );
};

export const fetchPaginated = (
  httpClient: HttpClient,
  data: SearchParams
) => {};

export const fetchOne = (httpClient: HttpClient, data: Trip) => {
  return httpClient.get<Trip>(`/trips/${data.id}`);
};
export const fetchById = (
  httpClient: HttpClient,
  id: z.infer<typeof schema>['id']
) => {
  return httpClient.get<Trip>(`/trips/${id}`);
};
