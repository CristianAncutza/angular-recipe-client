import { Component, inject, signal } from '@angular/core';
import { Recipe } from '../../../core/models/recipe';
import { RecipeService } from '../../../core/services/recipe.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recipes',
  imports: [RouterLink],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.scss',
})

export class RecipeList {
    private recipeService = inject(RecipeService);

    recipes = signal<Recipe[]>([]);
    isLoading = signal<boolean>(false);
    errorMessage = signal<string>('');

    ngOnInit(): void{
      this.loadRecipes();
    }

    loadRecipes(): void{
      this.isLoading.set(true);
      this.errorMessage.set('');

      this.recipeService.getRecipes().subscribe({
          next: (data: Recipe[]) => {
            this.recipes.set(data);
            this.isLoading.set(false);
          },
          error: (err: any) => {
            this.errorMessage.set("Error loading recipes.");
            this.isLoading.set(false);
            console.error(err);
        }
      });
    }

    deleteRecipe(id?: number): void{
      if(!id) return;

      if(confirm('Do you want to delete this recipe?')){
        this.recipeService.deleteRecipe(id).subscribe({
          next: () => {
            this.recipes.update(list => list.filter(r => r.id !== id));
          },
          error: (err: any) => {
            alert('Error deleting recipe.');
            console.error(err);
          }
        })
      }
    }
}
