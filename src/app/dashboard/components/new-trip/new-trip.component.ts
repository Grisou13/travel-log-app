import { initTE, Modal, Ripple, Stepper } from 'tw-elements';
import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { TravelLogService } from 'src/app/httpClients/travelLogApi/travel-log.service';
import { concatMap, forkJoin, mergeMap, of, switchMap } from 'rxjs';
import { Result } from '@shared/components/cities-search/cities-search.component';
import { Trip } from './../../models/trips';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-new-trip',
  templateUrl: './new-trip.component.html',
  styleUrls: ['./new-trip.component.sass'],
})
export class NewTripComponent implements OnInit, AfterViewInit {
  @ViewChild("stepper") stepper!: ElementRef;

  selectedStart: Result | null = null;

  private stepperInstance: any | null = null;
  private form = this.fb.group({
    start: this.fb.group({
      location: this.fb.group({
        lat: this.fb.control<number>(0,[]),
        lng: this.fb.control<number>(0,[])
      })
    })
  })

  constructor(private travelLogService: TravelLogService, private fb: FormBuilder) {}
  ngAfterViewInit(): void {
    this.stepperInstance = Stepper.getOrCreateInstance(this.stepper.nativeElement);
  }
  @Output() tripCreated = new EventEmitter<Trip>();
  ngOnInit(): void {
    initTE({ Modal, Ripple, Stepper });
    
  }
  setStart($event: Result){
    this.form.patchValue({
      start: {
        location: {
          lat: $event.location.coordinates[1],
          lng: $event.location.coordinates[0],
        }
      }
    });
    this.stepperInstance.nextStep();
  }
  public createTrip() {
    if (!this.selectedStart) return;
    const startCity = this.selectedStart;
    this.travelLogService.trips
      .create({
        title: startCity.name + ' ' + new Date().toLocaleDateString(),
        description: 'Trip to ' + startCity.name,
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
              name: startCity.name,
              pictureUrl: startCity.pictureUrl || undefined,
              description: 'First stop',
              location: startCity.location,
            }),
          ]);
        })
      )
      .subscribe(([trip, place]) => {
        console.debug(trip);

        this.tripCreated.emit({ ...trip });
      });
  }
  public onCitySelect($event: Result) {
    this.selectedStart = $event;
  }
}
