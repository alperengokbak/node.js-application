import Router from "express";
import { getUsers } from "../controllers/userController.js";

const router = Router();

//router.route("/").delete().patch().post().get(authMiddleware, getUsers);

router.get("/", getUsers);

export default router;
