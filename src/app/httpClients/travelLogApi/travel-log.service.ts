import { Injectable } from '@angular/core';

import { ArgumentTypes, SecondArgOfFunction } from 'src/app/helpers';
import usersFuncs from './users';
import tripFuncs from './trips';
import placesFuncs from './places';
import authFuncs from './auth';
import { TravelLogHttp } from './travel-log.http';
import { ErrorHandlerService } from '@shared/error-handler.service';
import { handleAppError } from '@shared/extensions/handleErrorRx.pipe';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class TravelLogService {
  constructor(
    private httpClient: TravelLogHttp,
    private errorHandler: ErrorHandlerService
  ) {}
  users = {
    create: (data: SecondArgOfFunction<typeof usersFuncs.create>) =>
      usersFuncs.create(this.httpClient, data).pipe(
        handleAppError(this.errorHandler, (err) => ({
          message: 'could not fetch data create your user profile, sorry',
          status: 0,
          context: 'user',
          error: err,
        }))
      ),
    fetchAll: (data: SecondArgOfFunction<typeof usersFuncs.fetchAll>) =>
      usersFuncs.fetchAll(this.httpClient, data).pipe(
        handleAppError(this.errorHandler, (err) => ({
          message: 'could not fetch data all users, sorry',
          status: 0,
          context: 'user',
          error: err,
        }))
      ),
    fetchOne: (data: SecondArgOfFunction<typeof usersFuncs.fetchOne>) =>
      usersFuncs.fetchOne(this.httpClient, data).pipe(
        handleAppError(this.errorHandler, (err) => ({
          message: 'could not fetch data your user, sorry',
          status: 0,
          context: 'user',
          error: err,
        }))
      ),
    remove: (data: SecondArgOfFunction<typeof usersFuncs.remove>) =>
      usersFuncs.remove(this.httpClient, data).pipe(
        handleAppError(this.errorHandler, (err) => ({
          message: 'could not delete your user, sorry',
          status: 0,
          context: 'user',
          error: err,
        }))
      ),
    update: (data: SecondArgOfFunction<typeof usersFuncs.update>) =>
      usersFuncs.update(this.httpClient, data).pipe(
        handleAppError(this.errorHandler, (err) => ({
          message: 'could not update your user, sorry',
          status: 0,
          context: 'user',
          error: err,
        }))
      ),
  };
  trips = {
    create: (data: SecondArgOfFunction<typeof tripFuncs.create>) =>
      tripFuncs.create(this.httpClient, data).pipe(
        handleAppError(this.errorHandler, (err) => ({
          message: 'could not create your new trip, sorry',
          status: 0,
          context: 'trip',

          error: err,
        }))
      ),
    fetchAll: (data: SecondArgOfFunction<typeof tripFuncs.fetchAll>) =>
      tripFuncs.fetchAll(this.httpClient, data).pipe(
        handleAppError(this.errorHandler, (err) => ({
          message: 'could not fetch data your trip, sorry',
          status: 0,
          context: 'trip',

          error: err,
        }))
      ),
    fetchOne: (data: SecondArgOfFunction<typeof tripFuncs.fetchOne>) =>
      tripFuncs.fetchOne(this.httpClient, data).pipe(
        handleAppError(this.errorHandler, (err) => ({
          message: 'could not fetch data your trip, sorry',
          status: 0,
          context: 'trip',

          error: err,
        }))
      ),
    fetchById: (id: SecondArgOfFunction<typeof tripFuncs.fetchById>) =>
      tripFuncs.fetchById(this.httpClient, id).pipe(
        handleAppError(this.errorHandler, (err) => ({
          message: 'could not fetch data your trip, sorry',
          status: 0,
          context: 'trip',

          error: err,
        }))
      ),
    remove: (data: SecondArgOfFunction<typeof tripFuncs.remove>) =>
      tripFuncs.remove(this.httpClient, data).pipe(
        handleAppError(this.errorHandler, (err) => ({
          message: `could not delete your trip ${data.title}, sorry`,
          status: 0,
          context: 'trip',

          error: err,
        }))
      ),
    removeById: (id: SecondArgOfFunction<typeof tripFuncs.removeById>) =>
      tripFuncs.removeById(this.httpClient, id).pipe(
        handleAppError(this.errorHandler, (err) => ({
          message: 'could not delete your trip, sorry',
          status: 0,
          context: 'trip',

          error: err,
        }))
      ),
    update: (data: SecondArgOfFunction<typeof tripFuncs.update>) =>
      tripFuncs.update(this.httpClient, data).pipe(
        handleAppError(this.errorHandler, (err) => ({
          message: `could not update your trip ${data.title}, sorry`,
          status: 0,
          context: 'trip',

          error: err,
        }))
      ),
    fetchByUser: (
      userId: ArgumentTypes<typeof tripFuncs.fetchByUser>[1],
      data: ArgumentTypes<typeof tripFuncs.fetchByUser>[2]
    ) =>
      tripFuncs.fetchByUser(this.httpClient, userId, data).pipe(
        handleAppError(this.errorHandler, (err) => ({
          message: `could not fetch data the trips for user${userId}, sorry`,
          status: 0,
          context: 'trip',

          error: err,
        }))
      ),
  };
  places = {
    create: (data: SecondArgOfFunction<typeof placesFuncs.create>) =>
      placesFuncs.create(this.httpClient, data),
    fetchAll: (data: SecondArgOfFunction<typeof placesFuncs.fetchAll>) =>
      placesFuncs.fetchAll(this.httpClient, data).pipe(
        handleAppError(this.errorHandler, (err) => ({
          message: 'could not fetch data for the places for your trip, sorry',
          status: 0,
          context: 'trip',

          error: err,
        }))
      ),
    fetchOne: (data: SecondArgOfFunction<typeof placesFuncs.fetchOne>) =>
      placesFuncs.fetchOne(this.httpClient, data),
    fetchById: (id: SecondArgOfFunction<typeof placesFuncs.fetchById>) =>
      placesFuncs.fetchById(this.httpClient, id),
    remove: (data: SecondArgOfFunction<typeof placesFuncs.remove>) =>
      placesFuncs.remove(this.httpClient, data),
    removeById: (id: SecondArgOfFunction<typeof placesFuncs.removeById>) =>
      placesFuncs.removeById(this.httpClient, id).pipe(
        handleAppError(this.errorHandler, (err) => ({
          message: 'could not remove your a place from your trip, sorry',
          status: 0,
          context: 'trip',

          error: err,
        }))
      ),
    update: (data: SecondArgOfFunction<typeof placesFuncs.update>) =>
      placesFuncs.update(this.httpClient, data),
  };
  auth = {
    login: (data: SecondArgOfFunction<typeof authFuncs.login>) =>
      authFuncs.login(this.httpClient, data).pipe(
        handleAppError(this.errorHandler, (err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              return {
                message: `Username or password incorrect`,
                status: 401,
                context: 'auth',
                error: err,
              };
            }
          }
          return {
            message: `could not login, sorry`,
            status: 0,
            context: 'auth',
            error: err,
          };
        })
      ),
    signup: (data: SecondArgOfFunction<typeof usersFuncs.create>) =>
      usersFuncs.create(this.httpClient, data).pipe(
        handleAppError(this.errorHandler, (err) => ({
          message: `could not signup, sorry`,
          status: 0,
          context: 'auth',
          error: err,
        }))
      ),
  };
}
