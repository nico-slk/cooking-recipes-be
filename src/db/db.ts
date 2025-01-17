import * as mysql2 from "mysql2";
import { Sequelize } from "sequelize";
import Config from "../config/config";

const { mysqlport, mysqldatabase, mysqlpassword, mysqluser } = Config;
const dbURL = `mysql://${mysqluser}:${mysqlpassword}@viaduct.proxy.rlwy.net:35853/${mysqldatabase}`;

const db = new Sequelize(dbURL, {
  dialect: "mysql",
  dialectModule: mysql2,
  logging: false,
  port: +mysqlport,
  timezone: "-03:00",
});

export default db;
