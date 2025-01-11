import { DataTypes } from "sequelize";
import db from "../db/db";
import Ingredients from "./ingredient.model";
import Recipe from "./recipe.model";

const RecipeIngredients = db.define("recipe_ingredients", {
  quantity: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Recipe.belongsToMany(Ingredients, { through: RecipeIngredients });
Ingredients.belongsToMany(Recipe, { through: RecipeIngredients });

export default RecipeIngredients;
