import { Router } from "express";
import { AuthService } from "../services";

const { createUser } = AuthService;

const route = Router();

route.post("/register", createUser);

export default route;
