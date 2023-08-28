# Documentation and goals of the project

https://mediacomem.github.io/comem-masrad-dfa/latest/subjects/intro/#7

(Project report)[./docs/readme.md]

# Requirements

- npm >= 9
- node >= 16
- @angular/cli >= 16.0.2

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

# Accessing the app

The app is already available and you don't have to build it yourself if you don't want.

https://travel-log-app-grisou13-b98de78dd78835c46dbbfad4b4aca23a8584b05.gitlab.io/

# Running the app

Before running the app you will need an api.

For that, there are a couple of ways to use the api that goes with the app, you will need to choose your way.

- Running api localy with the database
- using the already available api running, but it will be the prod api

## Running the API **locally**


Requirements:
- `mongodb`

To run the api locally you will need to create a `.env`

## Using the 
2 options are offered here: manual and vsocde

for vscode you go to the debugging tab then:
- Launch api
- ng-serve (firefox or chrome depending on the browser you have installed)

Or manually

```
cd <repo>
npm run start
# in another terminal
cd <repo>/comem-travel-log-api
npm run start
```


You shoul dbe good to go.

The app will be served at the following: `localhost:4200`
And the api will be at `localhost:3000`

## Running Trek Tracks

same as before. Either vscode or manually

vscode: 
- goto the debugging tab and run `ng-serve`  (firefox or chrome depending on the browser you have installed)

manually:

```
cd <repo>
npm run start
```

# Locator

The only app you will need to prepare your futur road trips!

The goal of this app: make travel planning easy

There has been a couple of frustrations regarding travel planning lately, where a lot of internet startups create paywalled products for planning trips, when they all use open source technologies.

There is also a common pattern where you have to plan your trips on 10 different apps.

Trek Tracks tries to simplify this by unifying everything under the same roof.

For now the app includes:

- Planning a road trip
- defining stops on the trip
- being able to see places of interest on each place you visite
- budget

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

# Difficulties

- Refactoring authentication to be in it's own module was a challenge because some systems worked before and stopped working. 
This was due to the nature of modules being independant, creating lazy loaded services (transient) and not singletons

This created a major error whilest handling auth because the auth service keept being re-instantiated all the time. Creating empty observables, and making guards not work.

- Refactoring the module alos required some extra steps that were barried in the documentation about how it needed the `forRoot` (`auth-module.ts`) and not just a module exposing it's own providers as "normal"

- Handling data and it's lifetime was a bit uneasy.
