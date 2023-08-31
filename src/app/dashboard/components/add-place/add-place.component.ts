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

export const newPlaceForm = new FormGroup(
  {
    location: new FormGroup(
      {
        lat: new FormControl<number | null>(null, [Validators.required]),
        lng: new FormControl<number | null>(null, [Validators.required]),
      },
      [Validators.required]
    ),
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.minLength(5)]),
    dateOfVisit: new FormControl('', [
      Validators.required,
      Validators.pattern(/\d\d\d\d-\d\d-\d\d/),
    ]),
    placeType: new FormControl<PlaceType>('TripStop', [Validators.required]),
    order: new FormControl<number | undefined>(undefined, []),
    pictureUrl: new FormControl('', []),
  },
  { updateOn: 'change' }
);

export type NewPlaceForm = typeof newPlaceForm.value;

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: [],
})
export class AddPlaceComponent implements OnInit {
  public newPlaceForm!: typeof newPlaceForm;
  public control!: FormControl;
  @OgInput() controlName!: string;
  @OgInput() placeHolder!: string;
  @OgInput() extraMarkers: L.Marker[] | null = null;

  constructor(private controlContainer: ControlContainer) {}

  clearDate() {
    this.control.reset();
  }

  ngOnInit(): void {
    initTE({ Ripple, Datepicker, Input });
    this.newPlaceForm = <typeof newPlaceForm>this.controlContainer.control;
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
