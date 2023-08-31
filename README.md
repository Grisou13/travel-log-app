# Trek Tracks

Welcome to the trek tracks project!

![https://gitlab.com/grisou13/travel-log-app/badges/master/pipeline.svg](https://gitlab.com/grisou13/travel-log-app/badges/master/pipeline.svg)
![https://gitlab.com/grisou13/travel-log-app/-/badges/release.svg](https://gitlab.com/grisou13/travel-log-app/-/badges/release.svg)

# Requirements

- npm >= 9
- node >= 16
- @angular/cli >= 16.0.2

# Documentation

The following docs are available:
- [tech choices](./docs/tech_choices.md)
  - explains a bit the evolution of the data models with previous version of the api
- [Installing and running the app](./docs/install.md)
- [overview with images of the app](./docs/overview.md)
- [Side notes of the different screens](./docs/screens.md)
  - what you can do on those screens and some pointers on what could've made the experience better

# Accessing the app

The app is already available and you don't have to build it yourself if you don't want.

https://travel-log-app-grisou13-b98de78dd78835c46dbbfad4b4aca23a8584b05.gitlab.io/


# Trek Tracks

The only app you will need to prepare your futur road trips!

The goal of this app: make travel planning easy

There has been a couple of frustrations regarding travel planning lately, where a lot of internet startups create paywalled products for planning trips, when they all use open source technologies.
There is also a common pattern where you have to plan your trips on 10 different apps.

Trek Tracks tries to simplify this by unifying everything under the same roof.

For now the app includes:
- Planning a road trip
- defining stops on the trip
- seing what points of interest are around the town you chose.
- being able to stop a trip when you are over with it, allowing you to unclutter your planning

Each place you want to visit and each trip can include a date of visit

The app is only for **you** and **your trips**. It isn't made to be collaborative yet.

PS: The app is for now only for **road trips** (so drivable routes). So trips with legs from one continent to another will break stuff...

# Set backs during development

- Refactoring authentication to be in it's own module was a challenge because some systems worked before and stopped working. 
This was due to the nature of modules being independant, creating lazy loaded services (transient) and not singletons

This created a major error whilest handling auth because the auth service keept being re-instantiated all the time. Creating empty observables, and making guards not work.

- Refactoring the module alos required some extra steps that were barried in the documentation about how it needed the `forRoot` (`auth-module.ts`) and not just a module exposing it's own providers as "normal"

- Handling lat/lng has been a bit of a pain.... This is only due to the choice of libraries and the fact that formats are never the same. The api wants an array `[lat, lng]` but the library leaflet produces `[lng, lat]` which sometimes resulted in some pretty weird bugs around the app


- Adding tailwind in the mix was probably not a great decision. There was already alot to learn and this made it a bit more confusing sometimes.
And prettier just doesn't style lines correctly with tailwind classes... which makes the thing even less readable.

Tailwind seems far more powerfull in a context where you can directly inline a function for a component. (eg: react)

- Handling dates.... common handling dates is the biggest mess in sowftware development ever... so yeah dates
