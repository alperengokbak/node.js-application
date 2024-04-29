import Router from "express";

import { register } from "../controllers/registerController.js";

const router = Router();

router.post("/", register);

export default router;
