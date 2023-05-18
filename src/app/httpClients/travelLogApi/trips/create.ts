import { HttpClient } from "@angular/common/http";
import { from, switchMap } from "rxjs";
import { z } from "zod";
import { Trip, validator } from "./schema";




export const create = (httpClient: HttpClient, data: Trip) => {
    return from(validator.partial().parseAsync(data))
    .pipe(
        switchMap(data => httpClient.post<Trip>("/trips", data))
    );
}