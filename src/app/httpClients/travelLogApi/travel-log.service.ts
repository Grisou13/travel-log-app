import { Injectable } from '@angular/core';

import { ArgumentTypes, SecondArgOfFunction } from 'src/app/helpers';
import usersFuncs from './users';
import tripFuncs from './trips';
import placesFuncs from './places';
import authFuncs from './auth';
import { TravelLogHttp } from './travel-log.http';

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
    fetchById: (id: SecondArgOfFunction<typeof tripFuncs.fetchById>) =>
      tripFuncs.fetchById(this.httpClient, data),
    remove: (data: SecondArgOfFunction<typeof tripFuncs.remove>) =>
      tripFuncs.remove(this.httpClient, data),
    update: (data: SecondArgOfFunction<typeof tripFuncs.update>) =>
      tripFuncs.update(this.httpClient, data),
    fetchByUser: (
      userId: ArgumentTypes<typeof tripFuncs.fetchByUser>[1],
      data: ArgumentTypes<typeof tripFuncs.fetchByUser>[2]
    ) => tripFuncs.fetchByUser(this.httpClient, userId, data),
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
