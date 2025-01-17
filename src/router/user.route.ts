import { Router } from "express";
import { ValidJWT } from "../lodash";
import { UserService } from "../services";

const router = Router();
const { validJwt } = ValidJWT;

const { getUser } = UserService;

router.get("/", validJwt, getUser);

export default router;
