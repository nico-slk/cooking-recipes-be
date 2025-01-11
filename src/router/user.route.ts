import { Router } from "express";
import { UserService } from "../services";

const router = Router();

const { getUser, testUser } = UserService;

router.get("/:id", getUser);
router.get("/", testUser);

export default router;
