import { Result } from "@shared/components/cities-search/cities-search.component";
import { Place } from "./models/places";
import { distance } from "../helpers";
import * as _ from "lodash";


export function getPlaceClosest(places: Place[], $event: Result): string {
  const distances = places.reduce((acc, cur) => {
    acc.push({ id: cur.id, dist: distance($event.location, cur.location) });
    return acc;
  }, [] as { id: string; dist: number }[]);
  const sorted = _.sortBy(distances, 'dist');
  return _.first(sorted)?.id || '-1';
}