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
};

export default Config;
