import { HttpClient } from "@angular/common/http";
import { from, switchMap } from "rxjs";
import { z } from "zod";
import { Place, validator } from "./schema";




export const remove = (httpClient: HttpClient, data: Place) => {
    return  httpClient.delete<Place>(`/places/${data.id}`);
}