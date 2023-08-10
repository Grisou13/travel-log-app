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
import { placeForm } from '../add-place/add-place.component';

export const addTrip = new FormGroup({
  startDate: new FormControl(),
  start: placeForm,
  end: placeForm,
});

export type NewTripForm = typeof addTrip.value;

@Component({
  selector: 'app-new-trip',
  templateUrl: './new-trip.component.html',
  styleUrls: ['./new-trip.component.sass'],
})
export class NewTripComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('stepper') stepper!: ElementRef;
  @Output() newTrip = new EventEmitter<NewTripForm>();
  form = addTrip;
  private sub: Subscription | null = null;

  private stepperInstance: any | null = null;

  constructor(
    private travelLogService: TravelLogService,
    private fb: FormBuilder
  ) {}
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.stepperInstance = Stepper.getOrCreateInstance(
      this.stepper.nativeElement
    );
  }
  ngOnInit(): void {
    initTE({ Modal, Ripple, Stepper });
  }

  setStart($event: Result) {
    this.form.patchValue({
      start: {
        location: {
          lat: $event.location.coordinates[1],
          lng: $event.location.coordinates[0],
        },
        title: $event.name,
      },
    });
    this.stepperInstance.nextStep();
  }
  public createTrip() {
    if (this.form.invalid) return;

    this.newTrip.emit(this.form.value);

    const form = this.form.value;
  }
}
