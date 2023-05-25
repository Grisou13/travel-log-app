import { Pipe, PipeTransform } from '@angular/core';
import { Observable, isObservable, of } from 'rxjs';
import { map, startWith, catchError } from 'rxjs/operators';

@Pipe({
  name: 'withLoading',
})
export class WithLoadingPipe implements PipeTransform {
  // public transform<T>(val: T): Observable<{ loading: boolean; value: T }>;
  // public transform<T>(val: T): Observable<{ loading: boolean }>;
  // public transform<T>(val: T): T;

  transform<T>(value: null): null;
  transform<T>(value: undefined): undefined;
  transform<T>(
    value: Observable<T> | null | undefined
  ): Observable<{ loading: boolean; value: T }> | null | undefined;
  transform<T>(value: T): Observable<{ loading: boolean; error: any }>;
  transform<T>(
    value: T
  ): Observable<{ loading: boolean; value: T }> | null | undefined;
  transform(value: Observable<any> | null | undefined): any {
    return isObservable(value)
      ? value.pipe(
          map((value: any) => ({
            loading: value.type === 'start',
            value: value.type ? value.value : value,
          })),
          startWith({ loading: true }),
          catchError((error) => of({ loading: false, error }))
        )
      : value;
  }
}
