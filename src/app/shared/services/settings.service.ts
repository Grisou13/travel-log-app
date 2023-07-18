import { Injectable } from '@angular/core';
import { PoisService } from '../../httpClients/open-route-service/pois/pois.service';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  shareReplay,
  tap,
} from 'rxjs';

export type Settings = {
  pois: {
    categories: number[];
    sub_categories: number[];
  };
};

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  SETTINGS_KEY = 'settings';
  private settingsState = new BehaviorSubject<Settings | null>({
    pois: {
      categories: [220, 100, 260],
      sub_categories: [],
    },
  });
  settings$ = this.settingsState.pipe(
    filter((x) => x !== null),
    tap({
      next: (v) => {
        if (v === null) return;
        this.saveSettings();
      },
    }),
    distinctUntilChanged(),
    shareReplay(1)
  );
  constructor(private poiService: PoisService) {
    this.loadFromStorage();
  }
  loadFromStorage() {
    const v = localStorage.getItem(this.SETTINGS_KEY);
    if (!v) return;
    const y = JSON.parse(v) as Settings | undefined;
    if (!y) return;
    this.settingsState.next(y);
  }
  saveSettings() {
    localStorage.setItem(
      this.SETTINGS_KEY,
      JSON.stringify(this.settingsState.getValue())
    );
  }

  togglePoi(selected: number) {
    let settings = this.settingsState.getValue();
    if (settings === null) return;

    let current = settings.pois.categories;
    const idx = current.indexOf(selected);

    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current = [...current, selected];
    }
    settings.pois.categories = current;
    this.settingsState.next({ ...settings });
  }
  togglePoiSubCategory(selected: number) {
    let settings = this.settingsState.getValue();
    if (settings === null) return;

    let current = settings.pois.sub_categories;
    const idx = current.indexOf(selected);

    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current = [...current, selected];
    }
    settings.pois.sub_categories = current;
    this.settingsState.next({ ...settings });
  }
}
