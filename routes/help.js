import Router from "express";
import { help } from "../controllers/helpController.js";

const router = Router();

router.route("/").post(help);
