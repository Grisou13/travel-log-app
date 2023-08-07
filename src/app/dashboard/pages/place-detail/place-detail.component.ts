import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
  takeLast,
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

type GetInsideObservable<X> = X extends Observable<infer I> ? I : never;
@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrls: ['./place-detail.component.sass'],
})
export class PlaceDetailComponent implements OnDestroy {
  place$ = this.route.paramMap.pipe(
    map((params) => {
      const id = params.get('placeId');
      if (id === null) return null;
      if (id.length <= 0) return null;
      return id;
    }),
    distinctUntilChanged(),
    switchMap((id) => {
      if (id === null) return of(null);
      return this.placeService.getPlacesWithRelated(id).pipe(
        catchError((err) => of(null)),
        map((x) => {
          if (typeof x === 'undefined' || typeof x === 'boolean') return null;
          return x;
        })
      );
    }),
    distinctUntilChanged(),
    shareReplay(1)
  );
  markers$ = this.place$.pipe(
    map((p) => {
      if (p === null) return [];
      const ret = [
        placeToMarker(p.current, {
          icon: iconDefault(`${p.current.order}`),
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

  directions$ = this.place$.pipe(
    map((p) => {
      if (p === null) return [];
      return [new L.GeoJSON(p.current.directions?.previous)];
    }),
    startWith([])
  );

  poi$ = zip([this.place$, this.settingsService.settings$]).pipe(
    switchMap(([place, settings]) => {
      if (typeof place?.current.location === 'undefined') return of(null);
      const location = place.current.location;
      //TODO: concat with pois already in the trip
      return this.poiService.fetchPois(location, {
        category_group_ids: settings?.pois.categories ?? [],
        category_ids: settings?.pois.sub_categories ?? [],
      });
      //.pipe(tap({ next: console.log }));
    }),
    startWith(null),
    catchError((err) => of(null)),
    distinctUntilChanged(),
    shareReplay(1)
  );

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
    private settingsService: SettingsService
  ) {}
  ngOnDestroy(): void {
    this._subs.forEach((x) => x.unsubscribe());
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
  togglePoi(place: Place, poi: PoiSearchResponse['features'][0]) {
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
}
