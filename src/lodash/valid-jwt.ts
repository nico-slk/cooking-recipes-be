import { NextFunction, Request, Response } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import config from "../config/config";

const { secret } = config;
const { verify } = jwt;

const validJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token = req.headers.authorization || "";
  if (typeof token === "object") {
    res.status(503).json({
      msg: "Not provided token",
    });
    return;
  }
  token = token.split(" ")[1] || "";

  if (token) {
    verify(
      token,
      secret || "test",
      (err: VerifyErrors | null, decoded: any) => {
        if (err) {
          res.status(403).json({
            msg: "Failed to authenticate token",
          });
          return;
        }

        if (typeof req.ip === "object") {
          res.status(503).json({
            msg: "Not provided ip",
          });
          return;
        }
        req.body["decoded"] = decoded;

        next();
      }
    );
  } else {
    res.status(503).json({
      msg: "Not provided token 2",
    });
  }
};

export default { validJwt };
