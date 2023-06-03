/*private tripsSubject = new BehaviorSubject<Trip | null>(null);

  public addTrip$ = this.tripsSubject.pipe(
    filter((x): x is Trip => !!x),
    map(mapValidatorToApi),
    switchMap((newTrip) => {
      if (!newTrip) return of(null);

      return this.travelLogService.trips
        .create(newTrip)
        .pipe(map(mapApiToData));
    })
  );

  private load$ = this.authService.user$.pipe(
    switchMap((user) => {
      if (!user) return of([]);

      return this.travelLogService.trips
        .fetchAll({ user: user.id })
        .pipe(map((x) => x.map(mapApiToData)));
      //.pipe(mergeMap((x) => x));
    })
  );

  private deleteTripSubject = new Subject<Trip>();

  public trips$ = combineLatest([
    this.load$,
    this.addTrip$.pipe(filter((x): x is Trip => !!x)),
    this.deleteTripSubject.asObservable(),
  ]).pipe(
    tap(([_items, addedTrip, deleteItem]) => {
      const items = _items.concat(addedTrip);
      if (deleteItem) {
        var index = items.findIndex((item) => item.id === deleteItem.id);
        if (index >= 0) {
          items.splice(index, 1);
        }
      }

      return items;
    }),
    distinctUntilChanged(),
    share()
  );*/
