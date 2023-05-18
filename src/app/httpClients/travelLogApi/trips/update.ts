import { HttpClient } from "@angular/common/http";
import { from, switchMap } from "rxjs";
import { Trip, schema } from "./schema";

export const update = (httpClient: HttpClient, data: Trip) => {
    return from(schema.parseAsync(data))
    .pipe(
        switchMap(data => httpClient.patch<Trip>(`/trips/${data.id}`, data))
    );
}