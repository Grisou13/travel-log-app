import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
//https://ng-run.com/edit/TmKtfF2wZL5HBnSUoPQS?open=app%2Fapp.component.html
export interface ObsWithStatusResult<T> {
  loading?: boolean;
  value?: T;
  error?: string;
}

const defaultError = 'Something went wrong';

@Pipe({
  name: 'withLoadingStatus',
})
export class WithLoadingStatusPipe implements PipeTransform {
  transform<T = any>(val: Observable<T>): Observable<ObsWithStatusResult<T>> {
    return val.pipe(
      map((value: any) => {
        if (typeof value.type === 'string' && value.type === 'start')
          return {
            loading: value.type === 'start',
            error: value.type === 'error' ? defaultError : '',
            value: value.type ? value.value : value,
          };
        return {
          loading: false,
          error: '',
          value: value,
        };
      }),
      startWith({ loading: true }),
      catchError((error) =>
        of({
          loading: false,
          error: typeof error === 'string' ? error : defaultError,
        })
      )
    );
  }
}
