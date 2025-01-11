import { Sequelize } from "sequelize";
import Config from "../config/config";
const { nameDB, userDB, passwordDB, hostDB, portDB } = Config;

const db = new Sequelize(nameDB, userDB, passwordDB, {
  host: hostDB,
  dialect: "mysql",
  logging: false,
  port: +portDB,
  timezone: "-05:00",
});

export default db;
