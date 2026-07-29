import { Observable } from "rxjs"
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class CategoryService{
    
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/categories`;    

    getCategories(): Observable<any[]> {        
        return this.http.get<any[]>(this.apiUrl);
    }
}