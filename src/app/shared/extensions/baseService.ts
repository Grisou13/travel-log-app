import { signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { cachable } from './cacheableOperator.rx';
import { toObservable } from '@angular/core/rxjs-interop';

export const add = signal(null);
export const update = signal(null);
export const remove = signal(null);
/*
export const serviceable = <T = any>(
  source: Observable<T[]>
): Observable<T[]> => {
  return source.pipe(
    cachable(
      toObservable(add.asReadonly()),
      toObservable(update.asReadonly()),
      toObservable(remove.asReadonly())
    )
  );
};*/
