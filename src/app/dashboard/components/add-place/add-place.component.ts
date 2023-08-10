import {
  Component,
  EventEmitter,
  Input as OgInput,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Datepicker, Ripple, Input, initTE } from 'tw-elements';

import {
  ControlContainer,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { PlaceType } from '@httpClients/travelLogApi/places/schema';
import { Result } from '@shared/components/cities-search/cities-search.component';
import { Subscription, distinctUntilChanged, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export const placeForm = new FormGroup({
  location: new FormGroup({
    lat: new FormControl<number>(0, []),
    lng: new FormControl<number>(0, []),
  }),
  title: new FormControl('', []),
  description: new FormControl('', []),
  dateOfVisit: new FormControl('', [Validators.pattern(/\d\d\d\d-\d\d-\d\d/)]),
  placeType: new FormControl<PlaceType>('TripStop', [Validators.required]),
  order: new FormControl<number | undefined>(undefined, []),
  pictureUrl: new FormControl('', []),
});

export type NewPlaceForm = typeof placeForm.value;

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: [],
})
export class AddPlaceComponent implements OnInit {
  public newPlaceForm!: typeof placeForm;
  public control!: FormControl;
  @OgInput() controlName!: string;
  @OgInput() placeHolder!: string;
  @OgInput() extraMarkers: L.Marker[] = [];

  constructor(private controlContainer: ControlContainer) {}

  clearDate() {
    this.control.reset();
  }

  ngOnInit(): void {
    initTE({ Ripple, Datepicker, Input });
    this.newPlaceForm = <typeof placeForm>this.controlContainer.control;
    this.control = <FormControl>this.newPlaceForm.get(this.controlName);

    const now = new Date(Date.now());
    const date = now.toISOString();

    /*this.newPlaceForm.patchValue({
      dateOfVisit: date.split('T')[0],
    });*/
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
