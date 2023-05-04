import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, Subject, from, of, tap } from 'rxjs';

export type Authentication = {
  authMethod: "default",
  credential: string,
  password: string
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public IsAuthenticated$ : Observable<boolean> 

  private isAuthenticatedEvent: Subject<boolean> = new Subject<boolean>();

  constructor(public jwtHelper: JwtHelperService) {
    this.IsAuthenticated$ = this.isAuthenticatedEvent.asObservable();
    
    // true or false
    this.isAuthenticatedEvent.next(this.isTokenValid());

  }
  public getToken(): string | null
  {
    return localStorage.getItem('token');    // Check whether the token is expired and return
  }
  public isTokenValid(): boolean
  {
    return !this.jwtHelper.isTokenExpired(this.getToken());
  }
  public authenticate(authInfo: Authentication): boolean
  {
    this.isAuthenticatedEvent.next(true);
    return true;
  }
}
