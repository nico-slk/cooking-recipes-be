import { config } from "dotenv";

config();

const Config = {
  port: process.env.PORT,
  hostDB: process.env.HOST_DB || "",
  userDB: process.env.USER_DB || "",
  portDB: process.env.PORT_DB || "",
  nameDB: process.env.NAME_DB || "",
  passwordDB: process.env.PASSWORD_DB || "",
  secret: process.env.AUTH_JWT_SECRET,

  mysql_database: process.env.MYSQL_DATABASE || "",
  mysql_public_url: process.env.MYSQL_PUBLIC_URL || "",
  musql_root_password: process.env.MYSQL_ROOT_PASSWORD || "",
  mysql_url: process.env.MYSQL_URL || "",
  mysqldatabase: process.env.MYSQLDATABASE || "",
  mysqlhost: process.env.MYSQLHOST || "",
  mysqlpassword: process.env.MYSQLPASSWORD || "",
  mysqlport: process.env.MYSQLPORT || "",
  mysqluser: process.env.MYSQLUSER || "",
};

export default Config;
