# Requirements

- nodejs >= 18
- npm
- mongodb running locally

## Setting up

Before running the app you will need an api and an access key to (`openrouteservices`)[https://openrouteservice.org/dev/#/login]

## Installing the frontend

```bash
git clone <repo>
cd <repo>
npm i -g @angular/cli
npm i
touch src/environments/environment.development.ts
```

And put the following contents:

```ts
export const environment = {
  travelLogApi: 'http://localhost:3000/api',
  openRouteServiceApiKey: '<YOUR KEY THAT YOU JUST GOT FROM OPEN ROUTE SERVICES>',
  openRouteUrl: 'https://api.openrouteservice.org/',
};

```

## Installing the API


To run the api locally you will need to create a `.env` at the root of the api directory with the following stuff in it

```bash
# It is recommended you use another terminal
cd <repo>
git submodule update --init --recursive
cd comem-travel-log-api/
npm i
touch .env
```

```txt
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

## Running the api

```
cd <repo>/comem-travel-log-api
npm run dev
```

# TL;DR

Install:

```bash
git clone <repo>
cd <repo>
npm i -g @angular/cli
npm i
# !!!!setup environment at this point!!!

git submodule update --init --recursive
cd comem-travel-log-api
npm i
# !!!!setup environment at this point!!!


```bash
cd <repo>
npm run start &
cd <repo>/comem-travel-log-api
npm run dev
```

The app will be served at the following: `localhost:4200`
