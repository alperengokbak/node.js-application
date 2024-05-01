import Router from "express";
import { searchall, searchbytitle } from "../../controllers/blogController.js";

const router = Router();

router.route("/").post(searchall, searchbytitle);

export default router;
