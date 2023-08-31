import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, map, tap } from 'rxjs';
import { TravelLogService } from 'src/app/httpClients/travelLogApi/travel-log.service';
import { initTE, Modal, Ripple, Stepper } from 'tw-elements';
import { newPlaceForm } from '../add-place/add-place.component';
import { requiredIfValidator } from 'src/app/helpers';
import * as L from 'leaflet';
import { iconDefault } from '../../../shared/components/map/map.component';
import { ActivatedRoute, Route } from '@angular/router';
import { Result } from '@shared/components/cities-search/cities-search.component';
import { dateToForm } from '../../helpers';
function addDays(date: Date, days: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
export const addTrip = new FormGroup(
  {
    defineStop: new FormControl<boolean | null>(null, [Validators.required]),
    start: new FormGroup({ ...newPlaceForm.controls }, [Validators.required]),
    end: new FormGroup({ ...newPlaceForm.controls }, [
      requiredIfValidator((form) => form?.get('defineStop')?.value ?? false),
    ]),
  },
  { updateOn: 'change' }
);

export type NewTripForm = typeof addTrip.value;
export const NEW_TRIP_STORAGE_KEY = 'new-trip-form';
@Component({
  selector: 'app-new-trip',
  templateUrl: './new-trip.component.html',
  styleUrls: ['./new-trip.component.sass'],
})
export class NewTripComponent implements OnInit {
  @ViewChild('stepper') stepper!: ElementRef;
  @Output() newTrip = new EventEmitter<NewTripForm>();
  form = new FormGroup({ ...addTrip.controls }, { updateOn: 'change' });
  _ = this.route.queryParamMap
    .pipe(
      tap({
        next: (params) => {
          if (!('initialData' in params)) {
            return;
          }
          try {
            const data = JSON.parse(params['initialData'] as string) as Result;
            this.form.patchValue({
              start: {
                location: {
                  lng: data.location.coordinates[0] ?? 0,
                  lat: data.location.coordinates[1] ?? 0,
                },
                title: data?.name ?? '',
                pictureUrl: data?.pictureUrl ?? '',
              },
            });
          } catch (err) {}
        },
      }),
      takeUntilDestroyed()
    )
    .subscribe();
  private stepperInstance: any | null = () =>
    Stepper.getOrCreateInstance(this.stepper.nativeElement);

  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    initTE({ Modal, Ripple, Stepper });
    const now = new Date();
    this.form.get('start.dateOfVisit')?.patchValue(dateToForm(now));
    this.form.get('defineStop')?.setValue(false);
  }
  startMarker$: Observable<L.Marker<any>[]> = this.form.valueChanges.pipe(
    map((value) => {
      const start = this.form.get('start.location');
      if (start === null) return [];
      if (start.value === null) return [];
      if (start.invalid) return [];
      if (start.value.lat === null) return [];
      if (start.value.lng === null) return [];
      return [
        L.marker([start.value.lat, start.value.lng], {
          icon: iconDefault('1'),
        }),
      ];
    })
  );

  previousStep() {
    this.stepperInstance().previousStep();
  }
  nextStep() {
    this.stepperInstance().nextStep();
  }
  validateStop() {
    if (this.form.controls.end.invalid) return;
    this.nextStep();
  }
  validateStart() {
    //if the date is not defined in the end (as to not re-do action)
    if (!this.form.controls.end.get('dateOfVisit')?.invalid) {
      let dateOfEnd = addDays(
        new Date(this.form.get('start.dateOfVisit')?.value || ''),
        1
      )
        .toISOString()
        .split('T')[0];
      this.form.patchValue({
        end: {
          dateOfVisit: dateOfEnd,
          title: '',
        },
      });
    }
    this.nextStep();
  }
  public clearStop() {
    this.form.patchValue({
      end: {
        title: '',
        description: '',
        location: {
          lat: null,
          lng: null,
        },
      },
    });
  }
  public createTrip() {
    if (this.form.controls.start.invalid) return;

    this.newTrip.emit(this.form.value);
  }
}
