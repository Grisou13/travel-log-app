#!/bin/bash

echo "export const environment = {
  travelLogApi: '$APIURL', //TODO move to localhost
  openRouteServiceApiKey:
    '$OPENROUTEKEY',
  openRouteUrl: 'https://api.openrouteservice.org/',
}" > src/environments.prod.ts
