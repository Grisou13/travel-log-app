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

# Running the app yourself

Before running the app you will need an api.

For that, there are a couple of ways to use the api that goes with the app, you will need to choose your way.

- Running api localy with the database
- using the already available api running, but it will be the prod api

## Running the API **locally**


Requirements:
- `mongodb`

To run the api locally you will need to create a `.env`

## Running the app
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


You should be good to go.

The app will be served at the following: `localhost:4200`
And the api will be at `localhost:3000`

## Running the frontend project

same as before. Either vscode or manually

vscode: 
- goto the debugging tab and run `ng-serve`  (firefox or chrome depending on the browser you have installed)

manually:

```
cd <repo>
npm run start
```
