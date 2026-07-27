import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AuthResponse, LoginRequest, RegisterRequest } from "../models/auth.model";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment.development";

@Injectable({
    providedIn: 'root'
})
export class AuthService{
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/auth`;

    login(credentials: LoginRequest) : Observable<AuthResponse>{
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response =>{
                localStorage.setItem('authToken', response.token);
            })
        )
    }

    logout(): void{
        localStorage.removeItem('authToken');
    }

    getToken(): string | null{
        return localStorage.getItem('authToken');
    }

    isAuthenticated(): boolean{
        return !!this.getToken();
    }

    register(credentials: RegisterRequest): Observable<any>{
        return this.http.post(`${this.apiUrl}/register`, credentials);
    }
}