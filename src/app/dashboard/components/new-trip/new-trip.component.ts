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
import { tap } from 'rxjs';
import { TravelLogService } from 'src/app/httpClients/travelLogApi/travel-log.service';
import { initTE, Modal, Ripple, Stepper } from 'tw-elements';
import { newPlaceForm } from '../add-place/add-place.component';
import { requiredIfValidator } from 'src/app/helpers';
import * as L from 'leaflet';
import { iconDefault } from '../../../shared/components/map/map.component';
function addDays(date: Date, days: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
export const addTrip = new FormGroup(
  {
    defineStop: new FormControl<boolean>(false, [Validators.required]),
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

  private stepperInstance: any | null = () =>
    Stepper.getOrCreateInstance(this.stepper.nativeElement);

  ngOnInit(): void {
    initTE({ Modal, Ripple, Stepper });
    const now = new Date();
    const d = now.toISOString().split('T')[0];
    this.form.get('start.dateOfVisit')?.patchValue(d);
    this.form.get('defineStop')?.setValue(false);
  }
  startMarker() {
    const start = this.form.get('start.location')?.value;
    if (!start) return [];

    return [
      L.marker([start?.lat ?? 0, start?.lng ?? 0], {
        icon: iconDefault('1'),
      }),
    ];
  }
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
        },
      });
    }
    this.nextStep();
  }
  public createTrip() {
    if (this.form.invalid) return;

    this.newTrip.emit(this.form.value);
  }
}
