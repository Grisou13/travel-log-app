import { HttpClient } from "@angular/common/http";
import { from, switchMap, tap } from "rxjs";
import { AuthResponse, UserCredential } from "./schema";
import { validator } from "../users/schema";


export const login = (httpClient: HttpClient, credentials: UserCredential) => {
    return from(validator.parseAsync(credentials))
    .pipe(
        switchMap(credentials => httpClient.post<AuthResponse>("/auth", credentials)),
        
    );
}