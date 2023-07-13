import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, filter, map, of, switchMap } from 'rxjs';
import { PlaceService } from '../../services/place.service';
import * as L from 'leaflet';
import { placeToMarker } from '../../helpers';
import { iconDefault } from '@shared/components/map/map.component';
import { Place } from '../../models/places';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrls: ['./place-detail.component.sass'],
})
export class PlaceDetailComponent {
  place$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id');
      if (id === null) return of(null);
      if (id.length <= 0) return of(null);

      return this.placeService.getPlacesWithRelated(id).pipe(
        map((x) => {
          if (typeof x === 'undefined' || typeof x === 'boolean') return null;
          return x;
        })
      );
    })
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
    })
  );
  mapData$ = combineLatest([this.markers$, this.directions$]).pipe(
    map(([markers, direction]) => ({ markers, direction }))
  );

  constructor(
    private route: ActivatedRoute,
    private placeService: PlaceService
  ) {}
}
