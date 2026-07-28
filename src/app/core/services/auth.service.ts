import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { AuthResponse, LoginRequest, RegisterRequest } from "../models/auth.model";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment.development";

@Injectable({
    providedIn: 'root'
})
export class AuthService{
    private http = inject(HttpClient);
    currentUser = signal<any>(null);
    private apiUrl = `${environment.apiUrl}/auth`;

    constructor() {            
        const email = localStorage.getItem('userEmail');
        
        if (email) {
            this.currentUser.set({ email });
        }
    }

    login(credentials: LoginRequest) : Observable<AuthResponse>{
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response =>{
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('userEmail', credentials.email);
                this.currentUser.set({email: credentials.email});
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