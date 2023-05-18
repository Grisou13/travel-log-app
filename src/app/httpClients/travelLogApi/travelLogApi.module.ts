import { Inject, Injectable, NgModule, inject } from "@angular/core";
import { fetchToken } from "../../auth/services/auth-service.service";
import { Observable } from "rxjs";
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { environment } from '../../../environments/environment';

export const baseUrl = () => environment.travelLogApi;

@Injectable()
export class BearerAuthTokenInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request.clone({
            setHeaders: {
                Authorization: `Bearer ${fetchToken()}`,
            },
        }));
    }
}

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
    constructor(
        @Inject('BASE_API_URL') private baseUrl: string) {
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request.clone({
            url: `${this.baseUrl}/${request.url}`
        }));
    }
}

@Injectable()
export class TravelLogApiHttp extends HttpClient {
}

@NgModule({
    imports:[
        HttpClientModule
    ],
    providers: [
        TravelLogApiHttp,
        {
            provide: HttpClient, useClass: TravelLogApiHttp
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: BearerAuthTokenInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: BaseUrlInterceptor,
            multi: true,
        },
        {
            provide: "BASE_API_URL", useValue: baseUrl()
        }
    ],
    exports: [
    ]
})
export class TravelLogApiModule {}