import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, catchError, concat, of, throwError } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {
  constructor(private errorHandlerService: ErrorHandlerService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        let message = err?.message ?? `Something went wrong`;
        if (err.error instanceof ErrorEvent) {
          message = err.error.message;
        }
        if (err.status === 0)
          this.errorHandlerService.handleError({
            message: `service not available, please try again later`,
            status: 0,
            context: 'global',
            error: err,
          });
        else
          this.errorHandlerService.handleError({
            message,
            status: err.status,
            context: 'global',
            error: err,
          });
        return throwError(
          () =>
            new HttpErrorResponse({
              error: err,
              headers: err.headers,
              status: err.status,
              statusText: err.statusText,
              url: err.url || req.url,
            })
        );
        /*return concat([
          of(
            new HttpResponse({
              body: { message, status: err.status },
              status: err.status,
            })
          ),
          throwError(() => new Error(message)),
        ]);*/
      })
    );
  }
}
