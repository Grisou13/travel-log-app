import {
  Inject,
  Injectable,
  InjectionToken,
  NgModule,
  Optional,
  inject,
} from '@angular/core';
import { fetchToken } from '../../auth/services/auth-service.service';
import { Observable } from 'rxjs';
import {
  HTTP_INTERCEPTORS,
  HttpBackend,
  HttpClient,
  HttpClientModule,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ArgumentTypes, SecondArgOfFunction } from 'src/app/helpers';
import usersFuncs from './users';
import tripFuncs from './trips';
import placesFuncs from './places';
import authFuncs from './auth';

export const baseUrl = () => environment.travelLogApi;
export const TRAVEL_LOG_BASE_API_URL = new InjectionToken<string>(
  'travel_log.base_url'
);
export const TRAVEL_LOG_HTTP_INTERCEPTORS = new InjectionToken<
  HttpInterceptor[]
>('An abstraction on feature HttpInterceptor[]');

class InterceptorHandler implements HttpHandler {
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
  constructor(@Inject(TRAVEL_LOG_BASE_API_URL) private baseUrl: string) {}
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
class TravelLogHttp extends HttpClient {
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
        [interceptors, moduleInterceptors].flat().filter((x) => !!x)
      )
    );
  }
}
@Injectable()
export class TravelLogService {
  constructor(private httpClient: TravelLogHttp) {}
  users = {
    create: (data: SecondArgOfFunction<typeof usersFuncs.create>) =>
      usersFuncs.create(this.httpClient, data),
    fetchAll: (data: SecondArgOfFunction<typeof usersFuncs.fetchAll>) =>
      usersFuncs.fetchAll(this.httpClient, data),
    fetchOne: (data: SecondArgOfFunction<typeof usersFuncs.fetchOne>) =>
      usersFuncs.fetchOne(this.httpClient, data),
    remove: (data: SecondArgOfFunction<typeof usersFuncs.remove>) =>
      usersFuncs.remove(this.httpClient, data),
    update: (data: SecondArgOfFunction<typeof usersFuncs.update>) =>
      usersFuncs.update(this.httpClient, data),
  };
  trips = {
    create: (data: SecondArgOfFunction<typeof tripFuncs.create>) =>
      tripFuncs.create(this.httpClient, data),
    fetchAll: (data: SecondArgOfFunction<typeof tripFuncs.fetchAll>) =>
      tripFuncs.fetchAll(this.httpClient, data),
    fetchOne: (data: SecondArgOfFunction<typeof tripFuncs.fetchOne>) =>
      tripFuncs.fetchOne(this.httpClient, data),
    remove: (data: SecondArgOfFunction<typeof tripFuncs.remove>) =>
      tripFuncs.remove(this.httpClient, data),
    update: (data: SecondArgOfFunction<typeof tripFuncs.update>) =>
      tripFuncs.update(this.httpClient, data),
  };
  places = {
    create: (data: SecondArgOfFunction<typeof placesFuncs.create>) =>
      placesFuncs.create(this.httpClient, data),
    fetchAll: (data: SecondArgOfFunction<typeof placesFuncs.fetchAll>) =>
      placesFuncs.fetchAll(this.httpClient, data),
    fetchOne: (data: SecondArgOfFunction<typeof placesFuncs.fetchOne>) =>
      placesFuncs.fetchOne(this.httpClient, data),
    remove: (data: SecondArgOfFunction<typeof placesFuncs.remove>) =>
      placesFuncs.remove(this.httpClient, data),
    update: (data: SecondArgOfFunction<typeof placesFuncs.update>) =>
      placesFuncs.update(this.httpClient, data),
  };
  auth = {
    login: (data: SecondArgOfFunction<typeof authFuncs.login>) =>
      authFuncs.login(this.httpClient, data),
    signup: (data: SecondArgOfFunction<typeof usersFuncs.create>) =>
      usersFuncs.create(this.httpClient, data),
  };
}

@NgModule({
  imports: [],
  providers: [
    {
      provide: TRAVEL_LOG_BASE_API_URL,
      useFactory: baseUrl,
      deps: [],
    },
    {
      provide: TRAVEL_LOG_HTTP_INTERCEPTORS,
      useClass: BearerAuthTokenInterceptor,
      multi: true,
    },
    {
      provide: TRAVEL_LOG_HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true,
    },
    TravelLogHttp,
    TravelLogService,
  ],
  exports: [],
})
export class TravelLogApiModule {}
