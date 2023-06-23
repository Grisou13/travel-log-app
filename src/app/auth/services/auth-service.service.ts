import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {
  BehaviorSubject,
  Observable,
  delay,
  of,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { TravelLogService } from '../../httpClients/travelLogApi/travel-log.service';
import {
  AuthParams,
  User,
} from 'src/app/httpClients/travelLogApi/users/schema';
import { AuthResponse } from 'src/app/httpClients/travelLogApi/auth/schema';

export const AUTH_KEY = 'travel-log-token';
export const USER_ID_KEY = 'user-id';
export const fetchToken = () => localStorage.getItem(AUTH_KEY);
export const fetchUserId = () => localStorage.getItem(USER_ID_KEY);
export type Authentication = {
  authMethod: 'default';
  credential: string;
  password: string;
};
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedEvent = new BehaviorSubject<boolean>(false);
  public IsAuthenticated$: Observable<boolean> = this.isAuthenticatedEvent
    .asObservable()
    .pipe(shareReplay(1));
  //.pipe(shareReplay({ bufferSize: 1, refCount: false }));

  private userEvent = new BehaviorSubject<null | User>(null);
  public user$: Observable<null | User> = this.IsAuthenticated$.pipe(
    switchMap((authenticated) => {
      if (!authenticated) {
        return of(null);
      }
      return this.resolveUser().pipe(shareReplay(1));
      //return this.userEvent.asObservable();
    }),
    shareReplay(1)
  );
  //.pipe(shareReplay({ bufferSize: 1, refCount: false }));

  constructor(private travelLogService: TravelLogService) {
    console.info('Creating auth service');
    this.isAuthenticatedEvent.next(this.isTokenValid());
  }

  public boot() {
    console.log('Booting auth service');
    return this.resolveUser().pipe(
      tap((user) => {
        if (!user) return;
        this.userEvent.next(user);
      })
    );
  }

  public getToken(): string | null {
    return fetchToken();
  }

  public isTokenValid(): boolean {
    return this.getToken() != null;
    // the api actually doesn't give a jwt token but a generic token
    // return !this.jwtHelper.isTokenExpired(this.getToken());
  }

  public logout() {
    localStorage.removeItem(AUTH_KEY);
    this.isAuthenticatedEvent.next(false);
    this.userEvent.next(null);
  }

  public signup(data: AuthParams) {
    return this.travelLogService.auth.signup(data).pipe(
      switchMap((res) =>
        this.authenticate({
          authMethod: 'default',
          credential: data.name,
          password: data.password,
        })
      )
    );
  }

  public authenticate(
    authInfo: Authentication
  ): Observable<AuthResponse | null> {
    return this.travelLogService.auth
      .login({
        username: authInfo.credential,
        password: authInfo.password,
      })
      .pipe(
        tap((res) => {
          this.isAuthenticatedEvent.next(true);
          this.userEvent.next(res.user);
          localStorage.setItem(AUTH_KEY, res.token);
          localStorage.setItem(USER_ID_KEY, res.user.id);
        })
      );
  }

  private resolveUser(): Observable<null | User> {
    //resolve user on startup, this is usefull so we don't keep the whole user object
    console.log('resolving user');
    const userId = fetchUserId();
    if (!userId) {
      console.log('no user nor token found');
      return of(null);
    }
    console.log('fetching him remotly');
    return this.travelLogService.users.fetchOne(userId);
  }
}
