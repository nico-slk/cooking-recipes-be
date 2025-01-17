import { DataTypes } from "sequelize";
import db from "../db/db";

const Recipe = db.define("recipe", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM("DESAYUNO", "ALMUERZO", "MERIENDA", "CENA"),
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT("long"),
  },
});

export default Recipe;
