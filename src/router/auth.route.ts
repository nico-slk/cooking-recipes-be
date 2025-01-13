import { Router } from "express";
import { AuthService } from "../services";

const { createUser, login } = AuthService;

const route = Router();

route.post("/register", createUser);
route.post("/login", login);

export default route;
