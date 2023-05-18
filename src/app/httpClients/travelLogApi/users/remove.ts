import { HttpClient } from "@angular/common/http";
import { from, switchMap } from "rxjs";
import { z } from "zod";
import { User, validator } from "./schema";




export const remove = (httpClient: HttpClient, data: User) => {
    return  httpClient.delete<User>(`/users/${data.id}`);
}