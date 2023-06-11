import {
  HttpBackend,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const OPEN_ROUTE_BASE_URL = new InjectionToken<string>(
  'Travel log api base url'
);
export const OPEN_ROUTE_INTERCEPTORS = new InjectionToken<HttpInterceptor[]>(
  'An abstraction on feature HttpInterceptor[]'
);

export const TRAVEL_LOG_BASE_API_URL = new InjectionToken<string>(
  'Travel log api base url'
);
export const TRAVEL_LOG_HTTP_INTERCEPTORS = new InjectionToken<
  HttpInterceptor[]
>('An abstraction on feature HttpInterceptor[]');

export class InterceptorHandler implements HttpHandler {
  constructor(
    private next: HttpHandler,
    private interceptor: HttpInterceptor
  ) {}

  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return this.interceptor.intercept(req, this.next);
  }
}
export class InterceptingHandler implements HttpHandler {
  private chain: HttpHandler;

  constructor(
    private backend: HttpBackend,
    private interceptors: HttpInterceptor[]
  ) {
    this.chain = this.interceptors.reduceRight(
      (next, interceptor) => new InterceptorHandler(next, interceptor),
      this.backend
    );
  }

  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return this.chain.handle(req);
  }
}
