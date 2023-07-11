import { Feature, FeatureCollection, Point } from 'geojson';
import { z } from 'zod';

export const GeocodeSearch = z.object({
  text: z.string(),
  'focus.point.lat': z.number().optional(),
  'focus.point.lon': z.number().optional(),
  'boundary.rect.min_lat': z.number().optional(),
  'boundary.rect.min_lon': z.number().optional(),
  'boundary.rect.max_lat': z.number().optional(),
  'boundary.rect.max_lon': z.number().optional(),
  'boundary.circle.lat': z.number().optional(),
  'boundary.circle.lon': z.number().optional(),
  'boundary.circle.radius': z.number().optional(),
  'boundary.gid': z.string().optional(),
  'boundary.country': z.string().optional(),
  sources: z.enum(['osm', 'oa', 'wof', 'gn']).optional(),
  layers: z
    .array(
      z.enum([
        'venue',
        'address',
        'street',
        'neighbourhood',
        'borough',
        'localadmin',
        'locality',
        'county',
        'macrocounty',
        'region',
        'macroregion',
        'country',
        'coarse',
        'postalcode',
      ])
    )
    .optional(),
  size: z.number().optional(),
});

export type GeocodeSearch = z.infer<typeof GeocodeSearch>;

export const GeocodeResponse = z
  .object({
    geocoding: z.object({
      version: z.string(),
      attribution: z.string(),
      query: z.object({
        text: z.string(),
        size: z.number(),
        layers: z.array(z.string()),
        private: z.boolean(),
        lang: z.object({
          name: z.string(),
          iso6391: z.string(),
          iso6393: z.string(),
          via: z.string(),
          defaulted: z.boolean(),
        }),
        querySize: z.number(),
        parser: z.string(),
        parsed_text: z.object({ subject: z.string(), venue: z.string() }),
      }),
      warnings: z.array(z.string()),
      engine: z.object({
        name: z.string(),
        author: z.string(),
        version: z.string(),
      }),
      timestamp: z.number(),
    }),
    type: z.literal('FeatureCollection'),
    features: z.array(
      z.object({
        type: z.literal('Feature'),
        geometry: z.object({
          type: z.literal('Point'),
          coordinates: z.array(z.number()),
        }),
        properties: z.object({
          id: z.string(),
          gid: z.string(),
          layer: z.string(),
          source: z.string(),
          source_id: z.string(),
          name: z.string(),
          confidence: z.number(),
          match_type: z.string(),
          accuracy: z.string(),
          country: z.string(),
          country_gid: z.string(),
          country_a: z.string(),
          region: z.string(),
          region_gid: z.string(),
          region_a: z.string(),
          county: z.string(),
          county_gid: z.string(),
          county_a: z.string(),
          continent: z.string(),
          continent_gid: z.string(),
          label: z.string(),
          addendum: z
            .object({ osm: z.object({ operator: z.string() }) })
            .optional(),
        }),
        bbox: z.array(z.number()).optional(),
      })
    ),
    bbox: z.array(z.number()),
  })
  .brand<'GeocodeResponse'>(); //satisfies z.ZodType<FeatureCollection<Feature<Point>>>;
//https://github.com/colinhacks/zod/discussions/2116
export type GeocodeResponse = z.infer<typeof GeocodeResponse>;

export const reverseGeocodeSearchSchema = GeocodeSearch.omit({
  text: true,
  'focus.point.lat': true,
  'focus.point.lon': true,
}).merge(
  z.object({
    'point.lat': z.number().optional(),
    'point.lon': z.number().optional(),
  })
);
export type ReverseGeocodeSearch = z.infer<typeof reverseGeocodeSearchSchema>;
