import Router from "express";
import { getUsers, getUserById } from "../../controllers/userController.js";
import ROLES_LIST from "../../config/rolesList.js";
import verifyRoles from "../../middleware/verifyRoles.js";

const router = Router();

router.route("/").get(getUsers);
router.route("/:id").get(verifyRoles(ROLES_LIST.Admin), getUserById);

export default router;
