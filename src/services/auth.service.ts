import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Config from "../config/config";
import db from "../db/db";
import { UserModel } from "../models";

const createUser = async (req: Request, res: Response): Promise<any> => {
  const transaction = await db.transaction();
  try {
    let { name, lastname, email, password, repassword } = req.body;

    if (password !== repassword)
      return res.status(400).send({
        message: "Las contraseñas no coinciden",
      });

    //Checkeamos el body recibido
    // const check = checkBody(body, ['email', 'password', 'name', 'lastname', 'phone']);

    // if (check) {
    //   return res.status(400).json({ msg: check });
    // }

    // name = capitalizeWord(name.trim());
    // lastname = capitalizeWord(lastname.trim());

    // //Validamos el formato del body
    // const valid = validRegexBody(body, {
    //   email: '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z]{2,6}$',
    //   password: '^(?=.{8,})(?=.*[A-Z])(?=.*[0-9])', //minimo 8 caracteres, 1 mayuscula y 1 numero
    // });

    // if (valid) {
    //   return res.status(400).json({ msg: valid });
    // }

    //Creamos el hash para la contraseña
    password = await bcrypt.hash(password, 12);

    //Registramos el usuario (Usamos un "save" para tener un ID generado)
    await UserModel.create(
      { name, lastname, email, password },
      { transaction }
    );

    await transaction.commit();
    res.json({
      msg: "¡Usuario registrado!",
    });
  } catch (err: unknown) {
    res.status(500).json({
      message: "Error inesperado del servidor",
      error: err instanceof Error ? err.message : err,
    });
  }
};

const login = async (req: Request, res: Response) => {
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

    const name = user.getDataValue("name");
    const lastname = user.getDataValue("lastname");

    res.status(200).send({
      user: { name, lastname, email },
      token,
    });
  } catch (error) {}
};

export default { createUser, login };
