import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Config from "../config/config";
import db from "../db/db";
import { StringManager } from "../lodash";
import { UserModel } from "../models";

const { capitalizeWord } = StringManager;

const createUser = async (req: Request, res: Response): Promise<any> => {
  const transaction = await db.transaction();
  try {
    let { name, lastname, email, password, repassword } = req.body;

    if (password !== repassword)
      return res.status(400).send({
        message: "Las contraseñas no coinciden",
      });

    name = capitalizeWord(name.trim());
    lastname = capitalizeWord(lastname.trim());

    // Creamos el hash para la contraseña.
    // No se que significa el 12, se que le da el formato '$2b$12$'
    password = await bcrypt.hash(password, 12);

    await UserModel.create(
      { name, lastname, email, password },
      { transaction }
    );

    await transaction.commit();
    res.json({
      msg: "¡Usuario registrado!",
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

const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  const { secret } = Config;
  try {
    const user = await UserModel.findOne({ where: { email } });

    if (!user)
      return res.status(404).send({ message: "Usuario no encontrado" });

    const isSamePassword = bcrypt.compare(
      password,
      user.getDataValue("password")
    );

    if (!isSamePassword)
      return res.status(404).json({
        msg: "Contraseña incorrecta",
      });

    const token = jwt.sign({ id: user.getDataValue("id") }, secret);

    const id = user.getDataValue("id");
    const name = user.getDataValue("name");
    const lastname = user.getDataValue("lastname");

    res.status(200).send({
      user: { id, name, lastname, email },
      token,
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

export default { createUser, login };
