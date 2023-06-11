import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
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
  InterceptorHandler,
  OPEN_ROUTE_BASE_URL,
} from '@httpClients/common';
import { OPEN_ROUTE_INTERCEPTORS } from '@httpClients/common';

export const baseUrl = () => environment.openRouteUrl;
export const fetchToken = () => environment.openRouteServiceApiKey;

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  constructor(@Inject(OPEN_ROUTE_BASE_URL) private baseUrl: string) {
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
export class ApiTokenInterceptor implements HttpInterceptor {
  token: string;
  constructor() {
    this.token = fetchToken();
  }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let req = request.clone({
      setHeaders: {
        Authorization: `${fetchToken()}`,
      },
    });
    if (request.method == 'GET') {
      req = request.clone({ setParams: { api_key: fetchToken() } });
    }
    return next.handle(req);
  }
}
@Injectable()
export class OpenRouteHttp extends HttpClient {
  constructor(
    backend: HttpBackend,
    @Optional() @Inject(HTTP_INTERCEPTORS) interceptors: HttpInterceptor[] = [],
    @Optional()
    @Inject(OPEN_ROUTE_INTERCEPTORS)
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
