import { HttpClient } from "@angular/common/http";
import { from, switchMap } from "rxjs";
import { z } from "zod";
import { SearchParams, User, searchParamValidator } from "./schema";





export const fetchAll = (httpClient: HttpClient, data: SearchParams) => {
    return from(searchParamValidator.parseAsync(data))
    .pipe(
        switchMap(data => httpClient.get<User>("/users", {params: data}))
    );
}

export const fetchPaginated = (httpClient: HttpClient, data: SearchParams) => {

}

export const fetchOne = (httpClient: HttpClient, data: User) => {
    return httpClient.get<User>(`/users/${data.id}`);
}