import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { fetchToken } from '../../auth/services/auth-service.service';
import { Observable } from 'rxjs';
import {
  HTTP_INTERCEPTORS,
  HttpBackend,
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const baseUrl = () => environment.travelLogApi;
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
@Injectable()
export class BearerAuthTokenInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(
      request.clone({
        setHeaders: {
          Authorization: `Bearer ${fetchToken()}`,
        },
      })
    );
  }
}

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  constructor(@Inject(TRAVEL_LOG_BASE_API_URL) private baseUrl: string) {
    this.baseUrl =
      this.baseUrl.charAt(this.baseUrl.length - 1) == '/'
        ? this.baseUrl.substr(0, this.baseUrl.length - 1) //remove trailing /
        : this.baseUrl;
  }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(
      request.clone({
        url: `${this.baseUrl}/${request.url}`,
      })
    );
  }
}

@Injectable()
export class TravelLogHttp extends HttpClient {
  constructor(
    backend: HttpBackend,
    @Optional() @Inject(HTTP_INTERCEPTORS) interceptors: HttpInterceptor[] = [],
    @Optional()
    @Inject(TRAVEL_LOG_HTTP_INTERCEPTORS)
    moduleInterceptors: HttpInterceptor[] = []
  ) {
    super(
      new InterceptingHandler(
        backend,
        [interceptors, moduleInterceptors].flat().filter((x) => !!x) //the injector might give us an empty array. So we need to filter them out
      )
    );
  }
}
