import Router from "express";
import { helpDesk } from "../controllers/helpController.js";

const router = Router();

router.route("/").post(helpDesk);

export default router;
