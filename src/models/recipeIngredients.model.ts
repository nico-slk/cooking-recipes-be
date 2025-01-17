import { DataTypes } from "sequelize";
import db from "../db/db";
import Ingredients from "./ingredient.model";
import Recipe from "./recipe.model";

const RecipeIngredients = db.define("recipe_ingredients", {
  recipeId: {
    type: DataTypes.UUID,
    references: {
      model: "recipe",
      key: "id",
    },
  },
  ingredientId: {
    type: DataTypes.UUID,
    references: {
      model: "ingredients",
      key: "id",
    },
  },
  quantity: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Ingredients.belongsToMany(Recipe, {
  through: RecipeIngredients,
  foreignKey: "ingredientId",
  otherKey: "recipeId",
});

Recipe.belongsToMany(Ingredients, {
  through: RecipeIngredients,
  foreignKey: "recipeId",
  otherKey: "ingredientId",
});

// Definir relaciones entre Recipe y RecipeIngredients
Recipe.hasMany(RecipeIngredients, { foreignKey: "recipeId" });
RecipeIngredients.belongsTo(Recipe, { foreignKey: "recipeId" });

// Definir relaciones entre Ingredients y RecipeIngredients
Ingredients.hasMany(RecipeIngredients, { foreignKey: "ingredientId" });
RecipeIngredients.belongsTo(Ingredients, { foreignKey: "ingredientId" });

export default RecipeIngredients;
