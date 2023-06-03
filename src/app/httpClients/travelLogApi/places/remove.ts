import { HttpClient } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { z } from 'zod';
import { Place, validator } from './schema';

export const remove = (httpClient: HttpClient, data: Place) => {
  return httpClient.delete(`/places/${data.id}`);
};
export const removeById = (httpClient: HttpClient, id: string) => {
  return httpClient.delete(`/places/${id}`);
};
