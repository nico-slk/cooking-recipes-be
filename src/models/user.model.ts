import { DataTypes } from "sequelize";
import db from "../db/db";
import Recipe from "./recipe.model";

const User = db.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  photo: {
    type: DataTypes.TEXT("long"),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasMany(Recipe, {
  foreignKey: "user_id",
  as: "recipes",
});

Recipe.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

export default User;
