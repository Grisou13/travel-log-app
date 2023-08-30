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
  distinctUntilChanged,
  startWith,
  EMPTY,
  filter,
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
  public items$ /*combineLatest([
    this.fetch({}),
    this.itemsSubject.asObservable(),
  ])
    .pipe(switchMap((x) => x)) = this.timer$.pipe(
    switchMap(() =>
      combineLatest([this.fetch({}), this.cacheSubject.asObservable()]).pipe(
        switchMap((x) => x)
      )
    ),*/ = this.cacheSubject
    .asObservable()
    .pipe
    // distinctUntilChanged(),
    // takeUntil(this.reload$),
    // shareReplay({ refCount: true, bufferSize: 1 })
    ();
  forceReload() {
    this.reload$.next();
  }

  clear(): void {
    this.cacheSubject.next([]);
  }

  protected getLocalCache(): T[] {
    return this.cacheSubject.getValue();
  }
  getAll(args: any) {
    const localItems = this.getLocalCache();
    return this.fetchRemote(args).pipe(
      startWith(localItems)
      // distinctUntilChanged(),
      // shareReplay(1)
      /*switchMap((items) => {
        return this.items$.pipe(startWith(items));
      })*/
    );
  }

  get(id: K) {
    const localItems = this.getLocalCache();
    const filterFn = (x: T) => x.id === id;
    const localItemIdx = localItems.findIndex(filterFn);
    let startItem = null;
    if (localItemIdx < 0) {
      startItem = localItems.at(localItemIdx);
    }
    if (typeof startItem === 'undefined') {
      startItem = null;
    }
    const itemsFromCache$ = this.items$.pipe(
      map((items) => {
        const idx = items.findIndex((x) => x.id === id);
        if (idx >= 0) return items[idx];
        return null;
      }),
      startWith(startItem)
    );
    return combineLatest([this.fetchItem(id), itemsFromCache$]).pipe(
      map(([_, cache]) => cache),
      distinctUntilChanged()
    );
    // if (placesForTrip.length > 0) return of(placesForTrip);
    /*

    const itemsFromCache$ = this.items$.pipe(
      map((items) => {
        const idx = items.findIndex((x) => x.id === id);
        if (idx >= 0) return items[idx];
        return null;
      }),
      startWith(startItem)
    );
    return combineLatest([this.fetchItem(id), itemsFromCache$]).pipe(
      map(([fetched, cache]) => {
        if (cache === null) return fetched;
        return cache;
      }),
      map((item) => {
        if (item === null) return false;
        if (item === undefined) return false;
        if (typeof item === 'boolean') return false;
        if (typeof item === 'undefined') return false;
        return true;
      })
    );
    */
    return this.fetchItem(id).pipe(
      switchMap((item) => {
        if (item === null) return of(null);
        if (item === undefined) return of(null);
        if (typeof item === 'boolean') return of(null);
        if (typeof item === 'undefined') return of(null);
        return of(item);
      }),
      startWith(startItem),
      filter((x) => x !== null)
      // distinctUntilChanged(),
      // shareReplay(1)
    ) as Observable<T>;
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

  protected fetchItem(id: K): Observable<T | boolean | null> {
    return this.fetchSingleRemote(id).pipe(
      tap({
        next: (val) => {
          const all = this.getLocalCache();
          const next = all.filter((x) => x.id === id);

          this.cacheSubject.next([...next, val]);
        },
      }),
      catchError((err) => {
        console.error(err);
        return of(false);
      }),
      distinctUntilChanged(),
      shareReplay({ refCount: true, bufferSize: 1 })
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
        console.error(err);
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
    const currentItems: T[] = this.getLocalCache();
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
    const currentItems: T[] = this.getLocalCache();
    currentItems.push(item);
    this.cacheSubject.next(currentItems);
  }

  protected updateItem(id: K, item: T): boolean {
    const currentItems: T[] = this.getLocalCache();
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
