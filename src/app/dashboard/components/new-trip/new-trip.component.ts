import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { tap } from 'rxjs';
import { TravelLogService } from 'src/app/httpClients/travelLogApi/travel-log.service';
import { initTE, Modal, Ripple, Stepper } from 'tw-elements';
import { placeForm } from '../add-place/add-place.component';
function addDays(date: Date, days: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
export const addTrip = new FormGroup(
  {
    startDate: new FormControl(),
    defineStop: new FormControl<boolean>(false, []),
    start: new FormGroup({ ...placeForm.controls }),
    end: new FormGroup({ ...placeForm.controls }),
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
  form = addTrip;

  private stepperInstance: any | null = () =>
    Stepper.getOrCreateInstance(this.stepper.nativeElement);

  ngOnInit(): void {
    initTE({ Modal, Ripple, Stepper });
  }

  previousStep() {
    this.stepperInstance().previousStep();
  }
  validateStop() {
    const wantsToStop = this.form.controls.defineStop.value;
    if (!wantsToStop) {
      this.stepperInstance().nextStep();
      return;
    }

    if (this.form.controls.end.invalid) return;
    this.stepperInstance().nextStep();
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
    this.stepperInstance().nextStep();
  }
  public createTrip() {
    if (!this.tripIsValid()) return;

    this.newTrip.emit(this.form.value);
  }
  tripIsValid() {
    return !this.form.controls.start.invalid;
  }
}
