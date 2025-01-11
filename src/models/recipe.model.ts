import { DataTypes } from "sequelize";
import db from "../db/db";

const Recipe = db.define("recipe", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
});

export default Recipe;
