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
- *[X] Success handler
- *[X] Map component
  - *[X] Add markers to map
  - *[X] add directions to map
  - *[X] Add Input/Output for center of map
  - *[X] Add Input/Output for map bounding box
  - *[X] Output onMapReady with map ref
- *[X] Search for cities
  - *[X] Button to trigger Geolocation on autocomplete field - Eric
    - *[X] Service for geolocation of navigator - Eric
    - *[X] Ability to center map - Eric
  - *[X] Map for cities search - Eric
    - *[X] Requires abaility to get events from map (Modify `app-map`) - Eric
  - *[X] On click of map reverse geocode to address - Eric
    - *[X] Update geocode service to be able to reverse geocode from lat/lng httpClient/open-route-service
      - *[X] map api models in typescript
      - *[X] add function in service to call api
      - *[X] Handle api errors
- *[X] Search for related poi on a trip
  - *[X] Use open route service to find pois
- *[X] directions for a trip
  - *[X] Center map on markers
- *[X] Maps for a trip - Thomas
- *[X] Toast service to notify user
  - *[X] Notify user on create trip
  - *[X] Notify user on create place
  - *[X] Notify user on delete trip
  - *[X] Notify user on delete place
  - *[X] Notify user on poi add
  - *[X] Notify user on poi delete
- *[X] Remove a place from a trip
- *[X] Remove a trip
- *[X] Past trips
- *[X] Present trips
- *[X] Add a new trip
  - *[X] Use component Eric is doing to create the new trip
  - *[X] Multi step form to create a trip
- *[X] Add place to trip
- *[X] Change order of place in trip
- *[X] Login
- *[X] Register

# Nice to have

## Components
- *[ ] Search for cities
  - *[ ] Keyboard navigation
  - *[ ] On enter get first element and validate  
- *[ ] Budget for a trip
- *[ ] Budget for a place on a trip
- *[ ] Budget with graphs
