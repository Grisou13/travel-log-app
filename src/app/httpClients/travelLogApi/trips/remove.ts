import { HttpClient } from "@angular/common/http";
import { from, switchMap } from "rxjs";
import { z } from "zod";
import { Trip, validator } from "./schema";




export const remove = (httpClient: HttpClient, data: Trip) => {
    return  httpClient.delete<Trip>(`/trips/${data.id}`);
}