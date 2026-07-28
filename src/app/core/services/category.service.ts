import { map, Observable } from "rxjs"
import { Recipe } from "../models/recipe"
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";

@Injectable({
    providedIn: 'root'
})

export class CategoryService{
    
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/categories`;    

    getCategories(): Observable<any[]> {
        console.log("CATEGORIAS");
        return this.http.get<any[]>(this.apiUrl);
    }
}