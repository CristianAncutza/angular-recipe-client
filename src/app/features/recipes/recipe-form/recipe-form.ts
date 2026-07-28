import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecipeService } from '../../../core/services/recipe.service';
import { CreateRecipeDto } from '../../../core/models/recipe';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-recipe-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.scss',
})

export class RecipeForm {
  private fb = inject(FormBuilder);
  private recipeService = inject(RecipeService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = signal<boolean>(false);
  IdRecipe = signal<number | null>(null);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  categories = signal<any[]>([]);

  recipeForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],    
    categoryId: [1, Validators.required],
    instructions: ['', [Validators.required]],
    prepTimeMinutes: [0, Validators.required],
    servings: [1, Validators.required],
    calories: [null],    
    description:[null],
    ingredients: this.fb.array([], [Validators.required])
  });

  newIngredientGroup = this.fb.group({
    name: [''],
    quantity: [''],
    unit: ['']
  });
  
  isAddingIngredient = signal<boolean>(false);
  
  tempName = new FormControl('');
  tempQuantity = new FormControl<number | null>(null);
  tempUnit = new FormControl('');

  showAddForm(): void {
    this.isAddingIngredient.set(true);
  }

  cancelAdd(): void {
    this.isAddingIngredient.set(false);    
  }

  ngOnInit(): void {
    this.loadCategories();
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
      next: (recipe: any) => {
        
        this.recipeForm.patchValue({
            title: recipe.title,
            instructions: recipe.instructions,
            prepTimeMinutes: recipe.prepTimeMinutes,
            servings: recipe.servings,
            calories: recipe.calories,
            categoryId: recipe.categoryId
        });
        
        this.ingredients.clear();

        const listToProcess = recipe.recipeIngredients?.$values || recipe.recipeIngredients || recipe.ingredients || [];

        listToProcess.forEach((ri: any) => {
          const ingredientName = ri.ingredient?.name || ri.name;

          const ingredientGroup = this.fb.group({
            name: [ingredientName, Validators.required],
            unit: [ri.unit, Validators.required],
            quantity: [ri.quantity, Validators.required]
          });
          this.ingredients.push(ingredientGroup);
        });

        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('No se pudo cargar la receta.');
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: any) => {
        const categoriesArray = Array.isArray(data) ? data : (data.categories || data.$values || []);
        this.categories.set(categoriesArray);
      },
      error: (err) => {
        console.error('Error loading categories', err);
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

  confirmAddIngredient(): void {
    const name = this.tempName.value?.trim();
    const quantity = this.tempQuantity.value;
    const unit = this.tempUnit.value?.trim();

    if (!name || !quantity) return;
    
    this.ingredients.push(this.fb.group({
      name: [name, Validators.required],
      quantity: [quantity, Validators.required],
      unit: [unit || '', Validators.required]
    }));

    this.isAddingIngredient.set(false);
  }
}
