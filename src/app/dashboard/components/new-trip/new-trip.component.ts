import { initTE, Modal, Ripple, Stepper } from 'tw-elements';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TravelLogService } from 'src/app/httpClients/travelLogApi/travel-log.service';
import {
  concatMap,
  forkJoin,
  mergeMap,
  of,
  Subscription,
  switchMap,
} from 'rxjs';
import { Result } from '@shared/components/cities-search/cities-search.component';
import { Trip } from './../../models/trips';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
} from '@angular/forms';
import { NewPlaceForm, placeForm } from '../add-place/add-place.component';

export const addTrip = new FormGroup({
  startDate: new FormControl(),
  start: new FormGroup({ ...placeForm.controls }),
  end: new FormGroup({ ...placeForm.controls }),
});

export type NewTripForm = typeof addTrip.value;

@Component({
  selector: 'app-new-trip',
  templateUrl: './new-trip.component.html',
  styleUrls: ['./new-trip.component.sass'],
})
export class NewTripComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper!: ElementRef;
  @Output() newTrip = new EventEmitter<NewTripForm>();
  form = addTrip;
  private sub: Subscription | null = null;

  private stepperInstance: any | null = () =>
    Stepper.getOrCreateInstance(this.stepper.nativeElement);

  constructor(
    private travelLogService: TravelLogService,
    private fb: FormBuilder
  ) {}
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    initTE({ Modal, Ripple, Stepper });
  }

  setStart($event: NewPlaceForm) {
    this.form.patchValue({
      start: {
        ...$event,
      },
    });
  }
  setStop($event: NewPlaceForm) {
    this.form.patchValue({
      end: {
        ...$event,
      },
    });
  }
  previousStep() {
    this.stepperInstance().previousStep();
  }
  validateStop() {
    this.stepperInstance().nextStep();
  }
  validateStart() {
    this.stepperInstance().nextStep();
  }
  public createTrip() {
    if (!this.tripIsValid()) return;

    this.newTrip.emit(this.form.value);
  }
  tripIsValid() {
    return !this.form.invalid;
  }
}
