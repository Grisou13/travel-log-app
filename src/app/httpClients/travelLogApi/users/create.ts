import { HttpClient } from "@angular/common/http";
import { from, switchMap } from "rxjs";
import { z } from "zod";
import { User, validator } from "./schema";




export const create = (httpClient: HttpClient, data: User) => {
    return from(validator.partial().or(z.object({
    })).parseAsync(data))
    .pipe(
        switchMap(data => httpClient.post<User>("/users", data))
    );
}