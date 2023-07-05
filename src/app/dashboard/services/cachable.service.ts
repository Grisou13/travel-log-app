import { ArgumentTypes } from 'src/app/helpers';
import { AuthService } from 'src/app/auth/services/auth-service.service';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  map,
  of,
  switchMap,
  tap,
  Observable,
  catchError,
  shareReplay,
  withLatestFrom,
  combineLatest,
  timer,
  Subject,
  takeUntil,
} from 'rxjs';

export type EntityWithId<K> = {
  id: K;
};

export abstract class CacheableService<
  T extends EntityWithId<K>,
  C = T,
  K = string
> {
  protected timer$ = timer(0, this.cacheTolerance);
  protected reload$ = new BehaviorSubject<void>(undefined);

  constructor(protected cacheTolerance: number = -1) {}

  protected cacheSubject = new BehaviorSubject<T[]>([]);
  public items$ = /*combineLatest([
    this.fetch({}),
    this.itemsSubject.asObservable(),
  ])
    .pipe(switchMap((x) => x)) = this.timer$.pipe(
    switchMap(() =>
      combineLatest([this.fetch({}), this.cacheSubject.asObservable()]).pipe(
        switchMap((x) => x)
      )
    ),*/
    this.cacheSubject.asObservable().pipe(
    // takeUntil(this.reload$),
    shareReplay({ refCount: true, bufferSize: 1 })
  );
  forceReload() {
    this.reload$.next();
  }

  clear(): void {
    this.cacheSubject.next([]);
  }

  protected getAll(): T[] {
    return this.cacheSubject.getValue();
  }

  get(id: K) {
    const currentItems: T[] = this.getAll();
    if (currentItems.length === 0) {
      return this.fetchItem(id);
    }

    const index1 = currentItems.findIndex((element) => {
      return element.id === id;
    });
    return index1 >= 0 && currentItems[index1]
      ? of(currentItems[index1])
      : this.fetchItem(id);
  }

  delete(id: K): Observable<boolean> {
    return this.removeRemote(id).pipe(
      map((data) => {
        return true;
      }),
      tap((success) => {
        if (success) {
          this.deleteItem(id);
        }
      }), // when success, delete the item from the local service
      catchError((err) => {
        return of(false);
      })
    );
  }

  protected fetchItem(id: K): Observable<T | boolean> {
    return this.fetchSingleRemote(id).pipe(
      catchError((err) => {
        return of(false);
      })
    );
  }

  update(id: K, payload: T) {
    return this.updateRemote(id, payload).pipe(
      tap((item) => {
        if (item) {
          this.updateItem(id, item);
        }
      }), // when success result, update the item in the local service
      catchError((err) => {
        return of(false);
      })
    );
  }

  add(payload: C) {
    return this.createRemote(payload)
      /*of({
      ...payload,
      id: id,
      href: `/Ts/${id}`,
      tripHref: `/trips/${payload.tripId}`,
    }) */ .pipe(
        tap((item) => {
          if (item) {
            this.addItem(item);
          }
        }), // when success, add the item to the local service
        catchError((err) => {
          return of(false);
        })
      );
  }

  protected deleteItem(id: K): boolean {
    const currentItems: T[] = this.getAll();
    if (currentItems.length > 0) {
      const index1 = currentItems.findIndex((element) => {
        return element.id === id;
      });
      if (index1 >= 0) {
        currentItems.splice(index1, 1);
        this.cacheSubject.next(currentItems);
        return true;
      }
    }
    return false;
  }

  protected addItem(item: T): void {
    const currentItems: T[] = this.getAll();
    currentItems.push(item);
    this.cacheSubject.next(currentItems);
  }

  protected updateItem(id: K, item: T): boolean {
    const currentItems: T[] = this.getAll();
    if (currentItems.length > 0) {
      const index1 = currentItems.findIndex((element) => {
        return element.id === id;
      });
      if (index1 >= 0) {
        currentItems[index1] = item;
        this.cacheSubject.next(currentItems);
        return true;
      }
    }
    return false;
  }

  fetch(params: any): Observable<T[]> {
    // this.clear();

    return this.fetchRemote(params).pipe(
      tap((items) => {
        if (items) {
          this.cacheSubject.next(items);
        }
      }),
      catchError((err) => {
        return of([]);
      })
    );
  }

  abstract createRemote(payload: C): Observable<T>;
  abstract fetchRemote(args: any): Observable<T[]>;
  abstract fetchSingleRemote(id: any): Observable<T>;
  abstract removeRemote(id: K): Observable<boolean>;
  abstract updateRemote(id: K, payload: T): Observable<T>;
}
