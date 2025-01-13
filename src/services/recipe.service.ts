import { Request, Response } from "express";
import db from "../db/db";
import { StringManager } from "../lodash";
import {
  IngredientsModel,
  RecipeIngredientsModel,
  RecipeModel,
} from "../models";

const { capitalizeWord } = StringManager;

const getRecipe = async (req: Request, res: Response): Promise<any> => {
  const { recipeId } = req.params;
  try {
    const recipe = await RecipeModel.findByPk(recipeId, {
      include: [
        {
          model: RecipeIngredientsModel,
          as: "recipe_ingredients",
          include: [
            {
              model: IngredientsModel,
              as: "ingredient",
            },
          ],
        },
      ],
    });

    if (!recipe) {
      return res.status(404).json({
        message: "Receta no encontrada.",
      });
    }

    const ingredients = recipe
      .getDataValue("recipe_ingredients")
      .map((item) => {
        const ingredient = item.ingredient;
        return {
          id: ingredient.id,
          name: ingredient.name,
          quantity: item.quantity,
          unit: item.unit,
        };
      });

    recipe.setDataValue("ingredients", ingredients);

    delete recipe.dataValues.recipe_ingredients;

    res.status(200).send({
      message: "Receta encontrada",
      recipe,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({
        message: "Error inesperado del servidor",
        error: err.message,
      });
    } else {
      if (err instanceof Error) {
        res.status(500).json({
          message: "Error inesperado del servidor",
          error: err instanceof Error ? err.message : err,
        });
      }
    }
  }
};

const getAllRecipes = async (req: Request, res: Response): Promise<any> => {
  try {
    const recipes = await RecipeModel.findAll();

    if (!Array.isArray(recipes)) {
      return res.status(404).send({
        message: "Hubo un error al intentar encontrar las recetas.",
      });
    }

    res.status(200).send({
      message: "Recetas encontradas.",
      recipes,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({
        message: "Error inesperado del servidor",
        error: err.message,
      });
    } else {
      if (err instanceof Error) {
        res.status(500).json({
          message: "Error inesperado del servidor",
          error: err instanceof Error ? err.message : err,
        });
      }
    }
  }
};

const createRecipe = async (req: Request, res: Response): Promise<any> => {
  const transaction = await db.transaction();
  const { id } = req.body.decoded;
  // ingredients es un array de objetos [ {...}, {name, quantity, unit}, {...}]
  const { ingredients, title, description, category } = req.body;

  try {
    // Si no encuentra la receta, la crea
    const recipe = await RecipeModel.create({
      title,
      description,
      user_id: id,
      category,
    });

    if (!recipe) {
      return res.status(404).send({
        message: "No se pudo crear la receta",
      });
    }

    for (const ingredientITem of ingredients) {
      const { name, quantity, unit } = ingredientITem;

      const ingredientName = capitalizeWord(name).trim();

      // Si no encuentra el ingrediente, lo crea y lo retorna
      const [ingredient] = await IngredientsModel.findOrCreate({
        where: { name: ingredientName },
      });

      // Creo el registor en la tabla intermedia con los ids de la receta, los ingredientes, cantidad y unidad de medida
      await RecipeIngredientsModel.create({
        recipeId: recipe.getDataValue("id"),
        ingredientId: ingredient.getDataValue("id"),
        quantity,
        unit,
      });
    }

    res.status(200).send({
      message: "Receta creada",
      recipe,
    });
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    if (err instanceof Error) {
      res.status(500).json({
        message: "Error inesperado del servidor",
        error: err.message,
      });
    } else {
      if (err instanceof Error) {
        res.status(500).json({
          message: "Error inesperado del servidor",
          error: err instanceof Error ? err.message : err,
        });
      }
    }
  }
};

const updateRecipe = async (req: Request, res: Response): Promise<any> => {
  const transaction = await db.transaction();
  const { recipeId } = req.params;
  const { ingredients, title, description } = req.body;

  try {
    const recipe = await RecipeModel.findByPk(recipeId, { transaction });

    if (!recipe)
      return res.status(403).send({
        message: "Receta no encontrada.",
      });

    // Actualizo la receta
    await RecipeModel.update(
      { title, description },
      { where: { id: recipeId }, transaction }
    );

    // Obtengo todos los ingredientes que pertecenen a esa receta
    const allIingredients = await RecipeIngredientsModel.findAll({
      where: { recipeId },
    });

    // Elimino todos los ingredientes que pertenecen a esa receta
    // await allIingredients.forEach(async () => {
    await RecipeIngredientsModel.destroy({
      where: { recipeId },
      transaction,
    });
    // });

    // Vuelvo a crear los ingredientes relacionados a la receta
    // Porque si quisiera agregar una receta o modificar el nombre,
    // es mas facil eliminar todos y volver a crearlos todos los ingredientes
    for (const ingredientITem of ingredients) {
      const { name, quantity, unit } = ingredientITem;
      const ingredientName = capitalizeWord(name).trim();

      const [ingredient] = await IngredientsModel.findOrCreate({
        where: { name: ingredientName },
        transaction,
      });

      await RecipeIngredientsModel.create(
        {
          recipeId: recipe.getDataValue("id"),
          ingredientId: ingredient.getDataValue("id"),
          quantity,
          unit,
        },
        { transaction }
      );
    }
    await transaction.commit();
    res.status(200).send({
      message: "Receta actualizada.",
    });
  } catch (err) {
    await transaction.rollback();
    if (err instanceof Error) {
      res.status(500).json({
        message: "Error inesperado del servidor",
        error: err.message,
      });
    } else {
      if (err instanceof Error) {
        res.status(500).json({
          message: "Error inesperado del servidor",
          error: err instanceof Error ? err.message : err,
        });
      }
    }
  }
};

const deleteRecipe = async (req: Request, res: Response): Promise<any> => {
  const { recipeId } = req.params;
  try {
    const recipe = await RecipeModel.findByPk(recipeId);

    if (!recipe)
      return res.status(403).send({
        message: "Receta no encontrada.",
      });

    await recipe.destroy();

    res.status(200).send({
      message: "Receta eliminada",
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({
        message: "Error inesperado del servidor",
        error: err.message,
      });
    } else {
      if (err instanceof Error) {
        res.status(500).json({
          message: "Error inesperado del servidor",
          error: err instanceof Error ? err.message : err,
        });
      }
    }
  }
};

const findRecipeByCategories = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { categories } = req.body;

  if (categories.length === 0) {
    return res.status(404).send({
      message: "Debes elegir al menos una categoria.",
    });
  }

  try {
    const recipes = await RecipeModel.findAll({
      where: {
        category: categories,
      },
    });

    if (!Array.isArray(recipes)) {
      return res.status(404).send({
        message: "Hubo un error al intentar encontrar las recetas.",
      });
    }

    res.status(200).send({
      message: "Recetas encontradas.",
      recipes,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({
        message: "Error inesperado del servidor",
        error: err instanceof Error ? err.message : err,
      });
    }
  }
};

const findRecipesByUserId = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.body.decoded;
  try {
    const recipes = await RecipeModel.findAll({
      where: {
        user_id: id,
      },
    });

    if (!Array.isArray(recipes)) {
      return res.status(404).send({
        message: "Hubo un error al intentar encontrar las recetas.",
      });
    }

    res.status(200).send({
      message: "Recetas encontradas.",
      recipes,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({
        message: "Error inesperado del servidor",
        error: err instanceof Error ? err.message : err,
      });
    }
  }
};

export default {
  getRecipe,
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  findRecipeByCategories,
  findRecipesByUserId,
};
