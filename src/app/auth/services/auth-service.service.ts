import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, ReplaySubject, Subject, catchError, from, map, of, tap } from 'rxjs';
import { login } from '../../httpClients/travelLogApi/auth/login';
import { TravelLogApiHttp } from '../../httpClients/travelLogApi/travelLogApi.module';
import { AuthModule } from '../auth.module';

export const AUTH_KEY = 'travel-log-token';

export const fetchToken = () => localStorage.getItem(AUTH_KEY);


export type Authentication = {
  authMethod: "default",
  credential: string,
  password: string
}
@Injectable()
export class AuthService {
  public IsAuthenticated$ : Observable<boolean> 

  private isAuthenticatedEvent: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  constructor(public jwtHelper: JwtHelperService, private httpClient: TravelLogApiHttp) {
    this.IsAuthenticated$ = this.isAuthenticatedEvent.asObservable();
    
    // true or false
    this.isAuthenticatedEvent.next(this.isTokenValid());

  }
  public getToken(): string | null
  {
    return fetchToken();
  }
  public isTokenValid(): boolean
  {
    return this.getToken() != null;
    // the api actually doesn't give a jwt token but a generic token
    // return !this.jwtHelper.isTokenExpired(this.getToken());
  }
  public logout()
  {
    localStorage.removeItem(AUTH_KEY);
    this.isAuthenticatedEvent.next(false);
  }
  public authenticate(authInfo: Authentication): Observable<boolean>
  {
    return login(this.httpClient, {username: authInfo.credential, password: authInfo.password})
      .pipe(
        tap(res => {
            localStorage.setItem(AUTH_KEY, res.token);
            this.isAuthenticatedEvent.next(true);
        }),
        map(x => true),
        catchError(err => of(false))
      );
  }
}
