import { Router } from "express";
import { ValidEmail } from "../lodash";
import { AuthService } from "../services";

const { isValidEmail } = ValidEmail;

const { createUser, login } = AuthService;

const route = Router();

route.post("/register", createUser);
route.post("/login", isValidEmail, login);

export default route;
