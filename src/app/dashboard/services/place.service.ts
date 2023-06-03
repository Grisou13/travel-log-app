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
} from 'rxjs';
import { TravelLogService } from '@httpClients/travelLogApi/travel-log.service';
import {
  AddPlace,
  Place,
  mapApiToData,
  mapDataToApi,
  mapValidatorToApi,
} from '../models/places';

@Injectable({
  providedIn: 'root',
})
export class PlaceService {
  private itemsSubject = new BehaviorSubject<Place[]>([]);
  public items$ = this.itemsSubject
    .asObservable()
    .pipe(withLatestFrom(this.fetch), shareReplay());

  constructor(
    private authService: AuthService,
    private travelLogService: TravelLogService
  ) {}

  clear(): void {
    this.itemsSubject.next([]);
  }

  private getAll(): Place[] {
    return this.itemsSubject.getValue();
  }

  get(id: string) {
    const currentItems: Place[] = this.getAll();
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

  delete(id: string): Observable<boolean> {
    return this.travelLogService.places.removeById(id).pipe(
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

  private fetchItem(id: string): Observable<Place | boolean> {
    return this.travelLogService.places.fetchById(id).pipe(
      map(mapApiToData),
      catchError((err) => {
        return of(false);
      })
    );
  }

  update(id: string, payload: Place) {
    return this.travelLogService.places.update(mapDataToApi(payload)).pipe(
      map(mapApiToData),
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

  add(payload: AddPlace) {
    return this.travelLogService.places.create(mapValidatorToApi(payload)).pipe(
      map(mapApiToData),
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

  private deleteItem(id: string): boolean {
    const currentItems: Place[] = this.getAll();
    if (currentItems.length > 0) {
      const index1 = currentItems.findIndex((element) => {
        return element.id === id;
      });
      if (index1 >= 0) {
        currentItems.splice(index1, 1);
        this.itemsSubject.next(currentItems);
        return true;
      }
    }
    return false;
  }

  private addItem(item: Place): void {
    const currentItems: Place[] = this.getAll();
    currentItems.push(item);
    this.itemsSubject.next(currentItems);
  }

  private updateItem(id: string, item: Place): boolean {
    const currentItems: Place[] = this.getAll();
    if (currentItems.length > 0) {
      const index1 = currentItems.findIndex((element) => {
        return element.id === id;
      });
      if (index1 >= 0) {
        currentItems[index1] = item;
        this.itemsSubject.next(currentItems);
        return true;
      }
    }
    return false;
  }

  fetch(): Observable<boolean | Place[]> {
    // this.clear();

    return this.authService.user$.pipe(
      switchMap((user) => {
        if (!user) return of([]);

        return this.travelLogService.places
          .fetchAll({})
          .pipe(map((x) => x.map(mapApiToData)));
      }),
      tap((items) => {
        if (items) {
          this.itemsSubject.next(items);
        }
      }),
      catchError((err) => {
        return of(false);
      })
    );
  }
}
