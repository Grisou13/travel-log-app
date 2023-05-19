import { HttpClient } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { z } from 'zod';
import { validator } from './schema';
import type { AuthParams, User } from './schema';

export const create = (httpClient: HttpClient, data: AuthParams) => {
  return from(validator.parseAsync(data)).pipe(
    switchMap((data) => httpClient.post<User>('/users', data))
  );
};
