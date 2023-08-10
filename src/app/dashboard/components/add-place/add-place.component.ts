import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Datepicker, Ripple, Input, initTE } from 'tw-elements';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { PlaceType } from '@httpClients/travelLogApi/places/schema';
import { Result } from '@shared/components/cities-search/cities-search.component';
import { Subscription, tap } from 'rxjs';

export const placeForm = new FormGroup({
  location: new FormGroup({
    lat: new FormControl<number>(0, []),
    lng: new FormControl<number>(0, []),
  }),
  title: new FormControl('', []),
  description: new FormControl('', []),
  dateOfVisit: new FormControl('', [Validators.pattern(/\d\d-\d\d-\d\d\d\d/)]),
  placeType: new FormControl<PlaceType>('TripStop', [Validators.required]),
  order: new FormControl<number>(-1, []),
  pictureUrl: new FormControl('', []),
});

export type NewPlaceForm = typeof placeForm.value;

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: [],
})
export class AddPlaceComponent implements OnInit, OnDestroy {
  sub$: Subscription | null = null;
  @Output() formUpdated = new EventEmitter<Partial<NewPlaceForm>>();

  newPlaceForm = placeForm;
  formUpdate$ = this.newPlaceForm.valueChanges.pipe(
    tap({
      next: (val) => {
        this.formUpdated.next(val);
      },
    })
  );

  ngOnDestroy(): void {
    this.sub$?.unsubscribe();
  }
  ngOnInit(): void {
    initTE({ Ripple, Datepicker, Input });

    const now = new Date(Date.now());
    const date = now.toISOString();

    this.newPlaceForm.patchValue({
      dateOfVisit: date.split('T')[0],
    });
    this.sub$ = this.formUpdate$.subscribe();
  }

  updateLocation($event: Result) {
    this.newPlaceForm.patchValue({
      location: {
        lng: $event.location.coordinates[0],
        lat: $event.location.coordinates[1],
      },
      title: $event.name,
    });
  }
}
