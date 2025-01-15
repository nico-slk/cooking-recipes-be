import { Request, Response } from "express";
import { UserModel } from "../models";

const getUser = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.body.decoded;

  try {
    const user = await UserModel.findByPk(id);
    if (!user) {
      return res.status(400).send({
        message: "Usuario no encontrado.",
      });
    }

    delete user.dataValues.password;

    res.status(200).send(user);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({
        message: "Error inesperado del servidor",
        error: err.message,
      });
    } else {
      res.status(500).json({ message: "Error inesperado del servidor" });
    }
  }
};

export default { getUser };
