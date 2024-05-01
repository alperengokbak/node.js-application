import Router from "express";
import { getUsers } from "../../controllers/userController.js";

const router = Router();

router.route("/").get(getUsers);

export default router;
