import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { PlaceService } from '../../services/place.service';
import * as L from 'leaflet';
import { placeToMarker } from '../../helpers';
import { iconDefault } from '@shared/components/map/map.component';
import { Place } from '../../models/places';
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
export class PlaceDetailComponent {
  place$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('placeId');
      if (id === null) return of(null);
      if (id.length <= 0) return of(null);

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
          icon: iconDefault,
        }),

        ...p.pois.map((x) => placeToMarker(x, { icon: iconDefault })),
      ];
      if (p.previousPlace !== undefined) {
        ret.push(placeToMarker(p.previousPlace, { icon: iconDefault }));
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

  poi$ = combineLatest([this.place$, this.settingsService.settings$]).pipe(
    switchMap(([place, settings]) => {
      if (typeof place?.current.location === 'undefined') return of(null);
      const location = place.current.location;

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

  tripHasPoi = (pois: Array<Partial<Place>>, osm_id: number) =>
    _.findIndex(pois, (x) => parseInt(x.infos?.misc_id ?? '-1') === osm_id) >=
    0;

  togglePoi(place: Place, poi: PoiSearchResponse['features'][0]) {
    //this.placeService.togglePoi(place.id, poi)
  }
  poiName(poi: PoiSearchResponse['features'][0]) {
    if (typeof poi.properties.osm_tags?.name !== 'undefined')
      return poi.properties.osm_tags?.name;

    const categoryId = Object.keys(poi.properties.category_ids)[0];

    return poi.properties.category_ids[categoryId].category_name;
  }
}
