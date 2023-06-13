# Documentation and goals of the project

https://mediacomem.github.io/comem-masrad-dfa/latest/subjects/intro/#7

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
npm i
cd ..
npm run start
```
# Locator

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

# Difficulties

- Refactoring authentication to be in it's own module was a challenge because some systems worked before and stopped working. 
This was due to the nature of modules being independant, creating lazy loaded services (transient) and not singletons

This created a major error whilest handling auth because the auth service keept being re-instantiated all the time. Creating empty observables, and making guards not work.

- Refactoring the module alos required some extra steps that were barried in the documentation about how it needed the `forRoot` (`auth-module.ts`) and not just a module exposing it's own providers as "normal"

