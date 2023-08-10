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
import {
  InterceptingHandler,
  TRAVEL_LOG_BASE_API_URL,
  TRAVEL_LOG_HTTP_INTERCEPTORS,
} from '@httpClients/common';

export const baseUrl = () => environment.travelLogApi;

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
    const url =
      request.url.charAt(0) === '/' ? request.url.substring(1) : request.url;
    return next.handle(
      request.clone({
        url: `${this.baseUrl}/${url}`,
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
