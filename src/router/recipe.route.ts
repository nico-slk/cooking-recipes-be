import { Router } from "express";
import { RecipeService } from "../services";

const router = Router();

const { getRecipe, createRecipe, updateRecipe, deleteRecipe } = RecipeService;

router.get("/", getRecipe);
router.post("/", createRecipe);
router.put("/:recipeId", updateRecipe);
router.delete("/:recipeId", deleteRecipe);
