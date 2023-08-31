import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subject,
  Subscription,
  combineLatest,
  concat,
  distinctUntilChanged,
  filter,
  forkJoin,
  map,
  of,
  retry,
  shareReplay,
  startWith,
  switchMap,
  takeLast,
  throwError,
  zip,
} from 'rxjs';
import { PlaceService } from '../../services/place.service';
import * as L from 'leaflet';
import { placeToMarker } from '../../helpers';
import { iconDefault } from '@shared/components/map/map.component';
import { AddPlace, Place } from '../../models/places';
import { PoisService } from '@httpClients/open-route-service/pois/pois.service';
import { catchError, tap } from 'rxjs';
import { SettingsService } from '@shared/services/settings.service';
import * as _ from 'lodash';
import { PoiSearchResponse } from '@httpClients/open-route-service/pois/types';
import { ArrayElement } from '../../../helpers';
import { Input, initTE } from 'tw-elements';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceDetailComponent implements OnDestroy, OnInit {
  form = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      startDate: new FormControl(''),
      pictureUrl: new FormControl(''),
    },
    { updateOn: 'change' }
  );
  toggle($event: any) {
    if (this.form.enabled) {
      this.form.disable();
      return;
    }
    initTE({ Input });
    this.form.enable();
  }
  initialValue: typeof this.form.value | null = null;
  sub: Subscription | null = null;
  ngOnInit(): void {
    initTE({ Input });
  }

  updatePlace(place: Place) {
    let startDate = place.startDate || Date.now;
    if (
      this.form.value?.startDate !== null &&
      typeof this.form.value?.startDate !== 'undefined'
    )
      startDate = new Date(this.form.value.startDate);

    this.sub = this.placeService
      .update(place.id, {
        ...place,
        name: this.form.value?.name ?? place.name,
        description: this.form.value?.description ?? place.description,
        startDate: new Date(startDate.toString()),
        pictureUrl: this.form.value?.pictureUrl ?? place.pictureUrl,
      })
      .subscribe({
        next: (val) => {
          if (typeof val === 'boolean') {
            this.toastrService.error(
              `Error in the data supplied to update your trip`,
              'Could not update place'
            );
          }
        },
        error: (err) => {
          this.toastrService.error(`${err}`, 'Could not update place');
        },
      });

    this.form.disable();
  }
  cancel() {
    this.form.reset(this?.initialValue ?? {});
    this.form.disable();
  }
  place$ = this.route.paramMap.pipe(
    map((params) => {
      const id = params.get('placeId');
      if (id === null) return null;
      if (id.length <= 0) return null;
      return id;
    }),
    switchMap((id) => {
      if (id === null) return of(null);
      return this.placeService.get(id);
    }),
    catchError((err) => of(null)),
    distinctUntilChanged((prev, cur) => {
      if (prev === null) return false;
      if (cur == null) return false;
      return prev.id === cur.id;
    }),
    tap({ next: (val) => console.log('New value for place ', val) }),
    shareReplay({ refCount: true, bufferSize: 1 })
  );
  relatedPlaces$ = this.place$.pipe(
    switchMap((place) => {
      if (place === null) return of(null);
      return this.placeService.fetchForTripId(place.tripId);
    }),
    catchError((err) => of([])),
    distinctUntilChanged(),
    tap({ next: (val) => console.log('New value for related place') }),
    shareReplay({ refCount: true, bufferSize: 1 })
  );
  vm$ = combineLatest([this.place$, this.relatedPlaces$]).pipe(
    map(([current, places]) => {
      if (current === null)
        return {
          current: null,
          pois: [],
          previousPlace: undefined,
          nextPlace: undefined,
          stops: [],
        };
      let related = places === null ? [] : places;
      const pois = related.filter(
        (x) =>
          x.infos?.relatedToPlace === current.id && x.type === 'PlaceOfInterest'
      );
      console.debug('Pois for place: ', pois);
      const stops = _.sortBy(
        related.filter((x) => x.type === 'TripStop'),
        'order'
      );
      const currentIdx = stops.findIndex((x) => x.id === current.id);

      let previousPlace = undefined;
      if (stops.length > 1) {
        previousPlace = stops[currentIdx - 1];
      }
      let nextPlace = null;
      if (currentIdx < stops.length - 1) {
        nextPlace = stops[currentIdx + 1];
      }
      return {
        current,
        pois,
        previousPlace,
        nextPlace,
        stops,
      };
    }),
    distinctUntilChanged(),
    shareReplay({ refCount: true, bufferSize: 1 }),
    tap({
      next: (val) => {
        console.debug(val);
        if (val.current === null) return;
        this.form.patchValue({
          name: val?.current.name ?? '',
          description: val?.current.description ?? '',
          startDate: val?.current.startDate?.toISOString() || '',
          pictureUrl: val?.current.pictureUrl ?? '',
        });
        this.initialValue = this.form.value;
        this.form.disable();
      },
    })
  );
  markers$ = this.vm$.pipe(
    map((p) => {
      if (p.current === null) return [];

      const ret = [
        placeToMarker(p!.current, {
          icon: iconDefault(`${p.current!.order}`),
        }),

        ...p.pois.map((x) => placeToMarker(x, { icon: iconDefault(``) })),
      ];
      if (p.previousPlace !== undefined) {
        ret.push(
          placeToMarker(p.previousPlace, {
            icon: iconDefault(`${p.previousPlace.order}`),
          })
        );
      }
      return ret;
    })
  );

  directions$ = this.vm$.pipe(
    map((p) => {
      if (p === null) return [];
      return [new L.GeoJSON(p.current?.directions?.previous)];
    }),
    startWith([])
  );

  poi$ = combineLatest([this.place$, this.settingsService.settings$]).pipe(
    switchMap(([place, settings]) => {
      if (typeof place?.location === 'undefined') return of(null);
      const location = place.location;
      //TODO: concat with pois already in the trip
      return this.poiService
        .fetchPois(location, {
          category_group_ids: settings?.pois.categories ?? [],
          category_ids: settings?.pois.sub_categories ?? [],
        })
        .pipe(
          map((x) => ({ type: 'end', value: x })),
          retry({ delay: () => this.retryPoiState.asObservable() }),
          catchError((err) =>
            concat(
              of({ type: 'error', value: null, error: err }),
              throwError(() => err)
            )
          )
        );
      //.pipe(tap({ next: console.log }));
    }),
    startWith({ type: 'start', value: null }),
    distinctUntilChanged(),
    shareReplay(1)
  );
  poisPerCategory(result: PoiSearchResponse | null) {
    if (result === null) return {};
    const res = result.features.reduce((acc, cur) => {
      const categoryId = Object.keys(cur.properties.category_ids)[0];

      const key =
        cur.properties.category_ids[
          categoryId
        ].category_group.toLocaleLowerCase();
      if (!(key in acc)) {
        acc[key] = [];
      }
      acc[key].push(cur);
      return acc;
    }, {} as { [key: string]: Array<(typeof result.features)[0]> });
    return res;
  }
  // geoJson$ = combineLatest([this.directions$, this.poi$]).pipe(
  //   map(([directions, pois]) => {
  //     if (pois !== null) {
  //       return [...directions, new L.GeoJSON(pois as any)];
  //     }
  //     return directions;
  //   }),
  //   startWith([])
  // );

  mapData$ = combineLatest([this.markers$, this.directions$]).pipe(
    map(([markers, direction]) => ({
      markers,
      direction,
    }))
  );

  constructor(
    private route: ActivatedRoute,
    private placeService: PlaceService,
    private poiService: PoisService,
    private settingsService: SettingsService,
    private toastrService: ToastrService,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    this._subs.forEach((x) => x.unsubscribe());
    this.sub?.unsubscribe();
    this.deleteSub$?.unsubscribe();
  }

  tripHasPoi(pois: Array<Partial<Place>>, osm_id: number) {
    //console.debug("Trying to find poi: ", osm_id)
    //console.debug("In pois: ",pois)
    return (
      _.findIndex(pois, (x) => parseInt(x.infos?.misc_id ?? '-1') === osm_id) >=
      0
    );
  }
  _subs: Subscription[] = [];
  togglePoi(place: Place, poi: ArrayElement<PoiSearchResponse['features']>) {
    console.log('TOGGLING POI');
    const poiName = `POI ${
      poi.properties.osm_tags?.name
    } ${poi.geometry.coordinates.join(', ')} for place ${place.name}`;
    const s = this.placeService
      .togglePoi(place.tripId, `${poi.properties.osm_id}`, {
        type: 'PlaceOfInterest',
        description: poiName,
        name: poiName,
        order: -1,
        tripId: place.tripId,
        infos: {
          category_ids: poi.properties.category_ids,
          misc_id: `${poi.properties.osm_id}`,
          relatedToPlace: place.id,
        },
        directions: {},
        location: {
          ...poi.geometry,
        },
      } as AddPlace)
      .subscribe({
        next: (val) => console.debug('Poi next value ', val),
        error: (err) => console.error('Could not toggle poi'),
        complete: () => console.debug('Toggled poi'),
      });
    this._subs.push(s);
  }
  poiName(poi: PoiSearchResponse['features'][0]) {
    if (typeof poi.properties.osm_tags?.name !== 'undefined')
      return poi.properties.osm_tags?.name;

    const categoryId = Object.keys(poi.properties.category_ids)[0];

    return poi.properties.category_ids[categoryId].category_name;
  }
  poiPhone(poi: PoiSearchResponse['features'][0]) {
    if(poi.properties.osm_tags?.phone === undefined) {return}
      return poi.properties.osm_tags.phone;
  }
  poiHours(poi: PoiSearchResponse['features'][0]) {
    if(poi.properties.osm_tags?.opening_hours === undefined) {return}
      return poi.properties.osm_tags.opening_hours;
  }
  poiWeb(poi: PoiSearchResponse['features'][0]) {
    if(poi.properties.osm_tags?.website === undefined) {return}
      return poi.properties.osm_tags.website;
  }
  deleteSub$: Subscription | null = null;

  deletePlace(place: Place, stops: Place[], pois: Place[]) {
    if (this.deleteSub$ != null) {
      this.deleteSub$.unsubscribe(); //don't repeat the operation if already subscribed?
    }
    const ordered = _.orderBy(stops, 'order');
    const currentIdx = ordered.findIndex((x) => x.id === place.id);

    const nextStops = ordered.splice(currentIdx + 1);
    const update = nextStops.map((stop) =>
      of(stop).pipe(
        switchMap((x) => {
          return this.placeService
            .update(x.id, {
              ...x,
              order: x.order - 1,
              directions: {
                distance: 0,
                previous: null,
                next: x.directions?.next,
              },
            })
            .pipe(
              map((x) => {
                if (typeof x === 'boolean') return x;
                return true;
              })
            );
        })
      )
    );

    this.deleteSub$ = forkJoin([
      this.placeService.delete(place.id),
      ...pois.map((x) => this.placeService.delete(x.id)),
      ...update,
    ])
      .pipe(
        catchError((err) => {
          console.error(err);
          this.toastrService.error(
            'Could not delete trip, please try again later'
          );
          return of(false);
        })
      )
      .subscribe({
        next: (val) => {
          if (val) {
            this.toastrService.success('Your place was deleted successfully');
            this.router.navigate([`/dashboard/trips/${place.tripId}`]);
          } else {
            this.toastrService.error(
              'Could not delete trip, please try again later'
            );
          }
        },
      });
  }

  retryPoiState = new Subject<void>();
  retryPoi() {
    this.retryPoiState.next();
  }
}
