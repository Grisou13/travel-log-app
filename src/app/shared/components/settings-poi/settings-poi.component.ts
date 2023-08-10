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
import * as L from 'leaflet';
import { iconDefault } from '@shared/components/map/map.component';
import { PoisService } from '@httpClients/open-route-service/pois/pois.service';
import { catchError, tap } from 'rxjs';
import { SettingsService } from '@shared/services/settings.service';
import { Settings } from '../../services/settings.service';
@Component({
  selector: 'app-settings-poi',
  templateUrl: './settings-poi.component.html',
  styleUrls: [],
})
export class SettingsPoiComponent {
  settings$ = this.settingsService.settings$;
  mainPoiCategorySelection = this.settingsService.settings$.pipe(
    map((settings) => settings?.pois.categories ?? [])
  );
  subCategoryPoiSelection = this.settingsService.settings$.pipe(
    map((settings) => settings?.pois.sub_categories ?? [])
  );

  poiCategories$ = this.poiService.fetchPoiCategories().pipe(
    distinctUntilChanged(),
    map((result) => {
      return Object.entries(result).map(([key, value]) => {
        return {
          name: key,
          ...value,
          children: Object.entries(value.children)
            .map(([childKey, childValue]) =>
              Object.entries(childValue).map(
                ([cName, cId]) =>
                  ({
                    name: childKey + '-' + cName,
                    id: cId,
                  } as { name: string; id: number })
              )
            )
            .flat(),
        };
      });
    }),
    tap({ next: console.log })
  );
  constructor(
    private route: ActivatedRoute,
    private poiService: PoisService,
    private settingsService: SettingsService
  ) {}

  toggleMainCategory(category: { name: string; id: number }) {
    this.settingsService.togglePoi(category.id);
  }

  toggleSubCategory(category: { name: string; id: number }) {
    this.settingsService.togglePoiSubCategory(category.id);
  }
  isSubCatSelected(settings: Settings, category: { name: string; id: number }) {
    return settings.pois.sub_categories.indexOf(category.id) >= 0;
  }

  isSelected(settings: Settings, category: { name: string; id: number }) {
    return settings.pois.categories.indexOf(category.id) >= 0;
  }
}
