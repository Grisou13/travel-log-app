import { HttpClient } from "@angular/common/http";
import { from, switchMap } from "rxjs";
import { z } from "zod";
import { Place, validator } from "./schema";




export const create = (httpClient: HttpClient, data: Place) => {
    return from(validator.parseAsync(data))
    .pipe(
        switchMap(data => httpClient.post<Place>("/places", data))
    );
}