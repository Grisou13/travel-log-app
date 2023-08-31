# Tech choices

Here will be discuessed breifly the low level tech choices that have been made for the project.


# Diffs between original model and the current model.

The api functionnality wise has not changed much, just the data models.

Here is a small doc, so you can see the difference between api models from the original repository:
https://github.com/Tazaf/comem-travel-log-api


Nota: the models have been modified alot at the start of the project imagining a way too big project...this is why some fields are not really in use but are present for future use

# Trip
Before:

```js
  title: {
    type: String,
    required: true,
    unique: true,
    uniqueValidator: true,
    minlength: 3,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50000
  }
```

After:
```js
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50000,
  },
  totalDistance: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: null,
  },

  budget: {
    type: Number,
  },
  transportMethod: {
    transportType: {
      type: String,
      enum: ["van", "car", "plane"],
      default: "car",
    },
    pricePerUnit: Number,
    unit: {
      type: String,
      enum: ["km", "flight", "trip"],
      default: "km",
    },
  },
```

Here are some explenations:
-  `transportMethod` is not used but would have been a nice adition to the app.
- `budget` is not used but could've been implemented in a reasonable amount of time
- `startDate` defines when the trip starts
- `endDate` defines when the trip ends. When this field is `not null` (so has a date) the trip is considered to be "stopped"
- `totalDistance` is not used and is not populated, this would require some work on the api level

# Place

Before:
```js
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
    validate: {
      validator: validateNameAvailable,
      message: 'There is already a place named "{VALUE}" in this trip',
      type: 'unique'
    }
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50000
  },
  location: {
    type: {
      type: String,
      required: true,
      enum: [ 'Point' ]
    },
    coordinates: {
      type: [ Number ],
      required: true,
      validate: {
        validator: validateCoordinates,
        message: 'Coordinates must be an array of 2 to 3 numbers: longitude (between -180 and 180) and latitude (between -90 and 90) and an optional altitude',
        type: 'coordinates'
      }
    }
  },
  pictureUrl: {
    type: String,
    minlength: 10,
    maxlength: 1000
  }
```


After:
```js
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  order: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50000,
  },
  location: {
    type: {
      type: String,
      required: true,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: validateCoordinates,
        message:
          "Coordinates must be an array of 2 to 3 numbers: longitude (between -180 and 180) and latitude (between -90 and 90) and an optional altitude",
        type: "coordinates",
      },
    },
  },
  infos: {
    relatedToPlace: {
      type: String,
      required: false,
      default: "",
    },
    category_ids: {
      type: Object,
      required: false,
      default: [],
    },
    misc_id: {
      type: String,
      required: false,
      default: "",
    },
  },
  pictureUrl: {
    type: String,
    minlength: 10,
    maxlength: 1000,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: null,
  },

  budget: {
    type: Number,
  },
  transportMethod: {
    transportType: {
      type: String,
      enum: ["van", "car", "plane"],
      default: "car",
    },
    pricePerUnit: Number,
    unit: {
      type: String,
      enum: ["km", "flight", "trip"],
      default: "km",
    },
  },
  directions: {
    type: Object,
    distance: Number,
    previous: {
      default: {},
      type: Object,
    },
    next: {
      default: {},
      type: Object,
    },
  },

  type: {
    type: String,
    enum: ["PlaceOfInterest", "TripStop"],
    default: "TripStop",
  },
```

- `name` removed the unique constraint because multiple users can have multiple places with the same generated name
- `order` defines the order in which this place appears in the trip. We could've used dates but ordering this way allows us to have 2 places that are very near within the same day (overlapping a little bit)
- `type` is the most significant difference. This fields defines if a place is a stop or is a poi, pois have extra information so they can relate to another place
- `directions` defines the geojson blob of coordinates that is returned by any directions api. This allows to display on the map a trace between 2 places that is coherant.
- `transportMethod` still not used
- `endDate` is not in use here
- `budget` same... lame...
- `infos` this is maybe the most interesting, this stores extra info that is not necesserly required by all places, but only by a poi
    - `relatedToPlace` defines which place a poi relates to. This allows us to create a link between places without defining another model
    - `category_ids` osm categories, it is mainly used for a poi
    - `misc_id` defines the osm id of the poi
