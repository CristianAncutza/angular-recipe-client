import { map, Observable } from "rxjs"
import { Recipe } from "../models/recipe"
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";

@Injectable({
    providedIn: 'root'
})

export class RecipeService{

    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/recipes`;

    
    getRecipeById(id: number): Observable<Recipe>{
        return this.http.get<Recipe>(`${this.apiUrl}/${id}`, { headers: this.getHeaders()});
    }

    createRecipe(recipe: Omit<Recipe, 'id'>): Observable<Recipe> {
        return this.http.post<Recipe>(`${this.apiUrl}`, recipe, { headers: this.getHeaders() });
    }

    updateRecipe(id: number, recipe: Recipe): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, recipe, { headers: this.getHeaders() });
    }

    deleteRecipe(id: number) {
      return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
    
    getRecipes() {
    return this.http.get<any>(`${this.apiUrl}`, { headers: this.getHeaders() }).pipe(
        map(response => response.$values || response)
    );
    }
    
    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token') || '';
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }
}