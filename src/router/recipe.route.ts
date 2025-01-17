import { Router } from "express";
import { ValidJWT } from "../lodash";
import { RecipeService } from "../services";

const router = Router();
const { validJwt } = ValidJWT;

const {
  getRecipe,
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  findRecipeByCategories,
  findRecipesByUserId,
} = RecipeService;

router.get("/:recipeId", getRecipe); // ✅
router.get("/", getAllRecipes); // ✅
router.get("/user/recipe", validJwt, findRecipesByUserId); // El id se envía por decode // ✅
router.post("/", validJwt, createRecipe); // El id se envía por decode // ✅
router.post("/category", findRecipeByCategories); // ✅
router.put("/:recipeId", validJwt, updateRecipe); // ✅
router.delete("/:recipeId", validJwt, deleteRecipe); // ✅

export default router;
