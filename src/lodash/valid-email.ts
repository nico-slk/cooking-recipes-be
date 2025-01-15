import { NextFunction, Request, Response } from "express";

const isValidEmail = (req: Request, res: Response, next: NextFunction): any => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  next();
};

export default { isValidEmail };
