import Router from "express";

import { handleLogout } from "../controllers/logoutController.js";

const router = Router();

router.post("/", handleLogout);

export default router;
