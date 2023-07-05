# Navigation

- *[ ] Define navigation routes and pages - Common
- *[ ] Implement pages
  - *[X] index - Thomas
  - *[X] login - Thomas
  - *[X] signup - Thomas
  - *[ ] dashboard
    - *[ ] home
    - *[ ] trip/details
    - *[ ] trip/maps
    - *[ ] trip/budget
    - *[ ] trip/:id/place/details

# Components

- *[X] Error handler - Thomas
- *[ ] Success handler
- *[X] Search for cities
  - *[ ] Button to trigger Geolocation on autocomplete field - Eric
    - *[ ] Service for geolocation of navigator - Eric
    - *[ ] Ability to center map - Eric
  - *[ ] Map for cities search - Eric
    - *[ ] Requires abaility to get events from map (Modify `app-map`) - Eric
  - *[ ] On click of map reverse geocode to address - Eric
    - *[ ] Update geocode service to be able to reverse geocode from lat/lng httpClient/open-route-service
      - *[ ] map api models in typescript
      - *[ ] add function in service to call api
      - *[ ] Handle api errors
- *[X] Search for related poi on a trip
  - *[ ] Use open route service to find pois
- *[X] directions for a trip
  - *[ ] Allow hover effect on directions, maybe pop an overlay with directions?
  - *[X] Center map on markers
- *[X] Maps for a trip - Thomas
- *[X] Toast service to notify user
  - *[X] Notify user on create trip
  - *[ ] Notify user on create place
  - *[ ] Notify user on delete trip
  - *[ ] Notify user on delete place
  - *[ ] Notify user on poi add
  - *[ ] Notify user on poi delete
- *[ ] Remove a place from a trip
- *[ ] Remove a trip
- *[ ] Past trips
- *[ ] Present trips
- *[X] Add a new trip
  - *[ ] Use component Eric is doing to create the new trip
  - *[ ] Multi step form to create a trip
- *[X] Add place to trip
- *[ ] Change order of place in trip
- *[X] Login
- *[X] Register

# Nice to have

## Components
- *[ ] Search for cities
  - *[ ] Keyboard navigation
  - *[ ] On enter get first element and validate  
- *[ ] Budget for a trip
- *[ ] Budget for a place on a trip
- *[ ] Budget with interesting graphs
