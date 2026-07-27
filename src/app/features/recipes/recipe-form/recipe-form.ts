import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecipeService } from '../../../core/services/recipe.service';
import { CreateRecipeDto } from '../../../core/models/recipe';

@Component({
  selector: 'app-recipe-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.scss',
})

export class RecipeForm {
  private fb = inject(FormBuilder);
  private recipeService = inject(RecipeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = signal<boolean>(false);
  IdRecipe = signal<number | null>(null);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  recipeForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(250)]],
    instructions: ['', [Validators.required]],
    prepTimeMinutes: [0, Validators.required],
    servings: [1, Validators.required],
    calories: [null],
    categoryId: [1, Validators.required],
    ingredients: this.fb.array([], [Validators.required])
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode.set(true);
      this.IdRecipe.set(+idParam);
      this.loadRecipeData(+idParam);
    }
  }

  loadRecipeData(id: number): void {
    this.isLoading.set(true);
    this.recipeService.getRecipeById(id).subscribe({
      next: (recipe) => {
        this.recipeForm.patchValue(recipe);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('No se pudo cargar la receta.');
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

  onSubmit(): void{
    if(this.recipeForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    const formValue = this.recipeForm.value;

    if(this.isEditMode() && this.IdRecipe() !== null){
      const updatedRecipe = {id: this.IdRecipe()!, ...formValue};
      this.recipeService.updateRecipe(this.IdRecipe()!, updatedRecipe).subscribe({
        next: () => this.router.navigate (['/recipes']),
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set("Error updating recipe.");
          console.log(err);
        }
      });
    }else{

      const newRecipe: CreateRecipeDto = {
        title: formValue.title,
        description: formValue.description,
        instructions: formValue.instructions,
        prepTimeMinutes: Number(formValue.prepTimeMinutes),
        servings: Number(formValue.servings),
        calories: formValue.calories ? Number(formValue.calories) : undefined,
        categoryId: Number(formValue.categoryId),
        ingredients: formValue.ingredients.map((i: any) => ({
          name: i.name,
          quantity: Number(i.quantity),
          unit: i.unit
        }))
      };

      this.recipeService.createRecipe(newRecipe).subscribe({
        next: () => this.router.navigate(['/recipes']),
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set('Error creating recipe.');
          console.log(err);
        }
      })
    }
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  addIngredient() {
    const ingredientGroup = this.fb.group({
      name: ['', Validators.required],
      unit: ['', Validators.required],
      quantity: ['', Validators.required]
    });
    this.ingredients.push(ingredientGroup);
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }
}
