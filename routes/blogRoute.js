import Router from "express";
import { searchall, searchbytitle } from "../controllers/blogController.js";

const router = Router();

router.post("/searchall", searchall);
router.post("/searchbytitle", searchbytitle);

export default router;
