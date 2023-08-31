# Install

```
npm i -g @angular/cli
git clone <repo>
cd <repo>
git submodule update --init --recursive
npm i
cd comem-travel-log-api
git pull
npm i
cd ..
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
And in another terminal `cd comem-travel-log-api; npm run dev`. This will run the api on port `3000`
# Running the app yourself

Before running the app you will need an api and an access key to (`openrouteservices`)[https://openrouteservice.org/dev/#/login]

```bash
touch src/environments/environment.development.ts
```

And put the following contents:

```ts
export const environment = {
  travelLogApi: 'http://localhost:3000/api',
  openRouteServiceApiKey: '<YOUR KEY>',
  openRouteUrl: 'https://api.openrouteservice.org/',
};

```


## Running the API

Requirements:
- `mongodb`

To run the api locally you will need to create a `.env` at the root of the api directory with the following stuff in it

```
DATABASE_URL=mongodb://localhost/travel-log-api
DATABASE_NAME=travel-log-api
SECRET=<some random string>
CORS=true
```

Of course you should personalise the database url and name for your local mongodb install.

## Running the frontend project

```
cd <repo>
npm run start
```


# TL;DR

```bash
# setup environment first!!!
cd <repo>
npm run start &
cd <repo>/comem-travel-log-api
npm run dev
```

The app will be served at the following: `localhost:4200`
