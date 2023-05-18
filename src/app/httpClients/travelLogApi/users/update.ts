import { HttpClient } from "@angular/common/http";
import { from, switchMap } from "rxjs";
import { User, schema } from "./schema";

export const update = (httpClient: HttpClient, data: User) => {
    return from(schema.parseAsync(data))
    .pipe(
        switchMap(data => httpClient.patch<User>(`/users/${data.id}`, data))
    );
}