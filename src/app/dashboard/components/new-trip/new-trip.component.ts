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
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-new-trip',
  templateUrl: './new-trip.component.html',
  styleUrls: [],
})
export class NewTripComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('stepper') stepper!: ElementRef;
  @Output() tripCreated = new EventEmitter<Trip>();

  private sub: Subscription | null = null;

  private stepperInstance: any | null = null;
  private form = this.fb.group({
    start: this.fb.group({
      location: this.fb.group({
        lat: this.fb.control<number>(0, []),
        lng: this.fb.control<number>(0, []),
      }),
      title: this.fb.control('', []),
      pictureUrl: this.fb.control('', []),
    }),
  });

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
    const form = this.form.value;
    this.sub = this.travelLogService.trips
      .create({
        title: form?.start?.title + ' ' + new Date().toLocaleDateString(),
        description: 'Trip to ' + form?.start?.title,
        startDate: new Date(),
      })
      .pipe(
        mergeMap((trip) => {
          return forkJoin([
            of(trip),
            this.travelLogService.places.create({
              tripId: trip.id,
              order: 0,
              type: 'TripStop',
              startDate: new Date(),
              directions: {
                distance: 0,
                next: {},
                previous: {},
              },
              name: form?.start?.title || 'Place for trip' + trip.id,
              pictureUrl: form?.start?.pictureUrl || undefined,
              description: 'First stop',
              location: {
                type: 'Point',
                coordinates: [
                  form.start?.location?.lng || 0,
                  form.start?.location?.lat || 0,
                ],
              },
            }),
          ]);
        })
      )
      .subscribe(([trip, place]) => {
        console.debug(trip);

        this.tripCreated.emit({ ...trip });
      });
  }
}
