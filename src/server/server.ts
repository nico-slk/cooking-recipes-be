import cors from "cors";
import express, { Application } from "express";
import fs from "fs";
import fsPromises from "fs/promises";
import { createServer, Server as ServerNode } from "http";
import morgan from "morgan";
import path from "path";
import Config from "../config/config";
import db from "../db/db";
import { ApiPaths } from "../routes";

export class Server {
  private app: Application;
  private port: string | number;
  ServerNode: ServerNode;

  constructor() {
    this.app = express();
    this.port = Config.port || 3000;
    this.dbConnection();
    this.middleware();
    this.routes();
    this.ServerNode = createServer(this.app);
  }

  async dbConnection() {
    try {
      await db.authenticate();
      await db
        .sync()
        .then(() => {
          console.log("Modelos sincronizados");
        })
        .catch((error) => {
          console.error("Error al sincronizar la base de datos:", error);
        });
      // await db.sync();
    } catch (error) {
      throw new Error(error as string);
    }
  }

  middleware() {
    this.app.use(
      cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      })
    );

    this.app.use(express.json({ limit: "5mb" }));
    this.app.use(express.urlencoded({ limit: "10mb", extended: true }));
    this.app.use(morgan("dev"));
  }

  routes() {
    ApiPaths.forEach(async ({ url, router }) => {
      const filePath = path.resolve(__dirname, "../router", `${router}.js`);

      try {
        await fsPromises.access(filePath, fs.constants.F_OK);

        const routeModule = await import(filePath.toString());
        this.app.use(`/api${url}`, routeModule.default || routeModule);
      } catch (error) {
        console.error(
          `El archivo ${filePath} no existe o no es accesible:`,
          error.message
        );
      }
    });
  }

  listen() {
    this.ServerNode.listen(this.port, () => {
      console.log("Servidor corriendo en el puerto", this.port);
    });
  }
}
