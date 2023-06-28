import { Injector } from '@angular/core';
import {
  ErrorHandlerService,
  ErrorMessage,
} from '@shared/error-handler.service';
import { Observable, catchError, finalize } from 'rxjs';
import { ArgumentTypes } from 'src/app/helpers';

export function handleAppError<T>(
  service: ErrorHandlerService,
  messageToToast: (err: any) => ErrorMessage
): (source: Observable<T>) => Observable<T> {
  let errorToToast: { toast: ErrorMessage | null };
  return function (source: Observable<T>): Observable<T> {
    return source.pipe(
      catchError((e) => {
        e.toast = messageToToast(e);
        errorToToast = e;
        throw e;
      }),
      finalize(() => {
        if (errorToToast && errorToToast.toast) {
          service.handleError(errorToToast.toast);
          errorToToast.toast = null; // since we save the reference to the error object, any future access to this field will get a null value.
        }
      })
    );
  };
}
