export interface Recipe {
  id: number;
  title: string;
  description?: string;
  instructions: string;
  prepTimeMinutes: number;
  servings: number;
  calories?: number;
  categoryId: number;
  ingredients: RecipeIngredientDto[];
  recipeIngredients?: Array<{ 
    quantity: string | number;
    ingredient: {
      name: string;
      unit: string;
    };
  }>;
}

export interface RecipeIngredientDto {
  name: string; 
  quantity: string;
  unit: string;
}

export interface CreateRecipeDto {
  title: string;
  description?: string;
  instructions: string;
  prepTimeMinutes: number;
  servings: number;
  calories?: number;
  categoryId: number;
  ingredients: RecipeIngredientDto[];
}