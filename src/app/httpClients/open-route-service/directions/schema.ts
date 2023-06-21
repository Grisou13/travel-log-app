import { MultiPolygon, Polygon } from 'geojson';
import { z } from 'zod';
export const DrivingProfils = z.enum(['driving-car']);
export type DrivingProfils = z.infer<typeof DrivingProfils>;

export const DirectionRequest = z
  .object({
    coordinates: z.array(z.array(z.number())),
    alternative_routes: z
      .object({
        share_factor: z.number(),
        target_count: z.number(),
        weight_factor: z.number(),
      })
      .optional(),
    attributes: z
      .array(
        z.union([
          z.literal('avgspeed'),
          z.literal('detourfactor'),
          z.literal('percentage'),
        ])
      )
      .optional(),
    continue_straight: z.boolean().optional(),
    elevation: z.boolean().optional(),
    extra_info: z
      .array(
        z.union([
          z.literal('countryinfo'),
          z.literal('csv'),
          z.literal('green'),
          z.literal('noise'),
          z.literal('osmid'),
          z.literal('roadaccessrestrictions'),
          z.literal('shadow'),
          z.literal('steepness'),
          z.literal('suitability'),
          z.literal('surface'),
          z.literal('tollways'),
          z.literal('traildifficulty'),
          z.literal('waycategory'),
          z.literal('waytype'),
        ])
      )
      .optional(),
    geometry_simplify: z.boolean().optional(),
    id: z.any().optional(),
    instructions: z.boolean().optional(),
    instructions_format: z
      .union([z.literal('text'), z.literal('html')])
      .optional(),
    language: z.union([z.literal('en'), z.literal('fr')]).optional(),
    maneuvers: z.boolean().optional(),
    options: z
      .object({
        avoid_borders: z.union([
          z.literal('all'),
          z.literal('controlled'),
          z.literal('none'),
        ]),
        avoid_countries: z.array(z.number()),
        avoid_features: z.array(
          z.union([
            z.literal('highway'),
            z.literal('tollways'),
            z.literal('ferries'),
          ])
        ),
        avoid_polygons: z.any(), // Polygon|MultiPolygon,
        round_trip: z.object({
          length: z.number(),
          points: z.number(),
          seed: z.number(),
        }),
      })
      .optional(),
    preference: z
      .union([
        z.literal('fastest'),
        z.literal('recommended'),
        z.literal('shortest'),
      ])
      .optional(),
    radiuses: z.array(z.number()).optional(),
    suppress_warnings: z.boolean().optional(),
    units: z
      .union([z.literal('km'), z.literal('m'), z.literal('mi')])
      .optional(),
    geometry: z.boolean().optional(),
    maximum_speed: z.number().optional(),
  })
  .brand<'DirectionRequest'>();
export type DirectionRequest = z.infer<typeof DirectionRequest>;

export const DirectionsResponse = z.object({
  routes: z.array(
    z.object({
      summary: z.object({ distance: z.number(), duration: z.number() }),
      segments: z.array(
        z.object({
          distance: z.number(),
          duration: z.number(),
          steps: z.array(
            z.object({
              distance: z.number(),
              duration: z.number(),
              type: z.number(),
              instruction: z.string(),
              name: z.string(),
              way_points: z.array(z.number()),
            })
          ),
        })
      ),
      bbox: z.array(z.number()),
      geometry: z.string(),
      way_points: z.array(z.number()),
    })
  ),
  bbox: z.array(z.number()),
  metadata: z.object({
    attribution: z.string(),
    service: z.string(),
    timestamp: z.number(),
    query: z.object({
      coordinates: z.array(z.array(z.number())),
      profile: z.string(),
      format: z.string(),
    }),
    engine: z.object({
      version: z.string(),
      build_date: z.string(),
      graph_date: z.string(),
    }),
  }),
});
export type DirectionsResponse = z.infer<typeof DirectionsResponse>;
