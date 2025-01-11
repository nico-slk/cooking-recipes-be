import { DataTypes } from "sequelize";
import db from "../db/db";

const Ingredients = db.define("ingredients", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

export default Ingredients;
