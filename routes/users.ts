import * as express from "express";
import UserController from "_/controllers/handlers/users";
import ensureAuthenticated from "_/middlewares/ensureAuthenticated";

const router = express.Router();

router.get("/", UserController.searchUsers);
router.get("/:id", UserController.getOneUserById);
router.get("/myself", ensureAuthenticated, UserController.getMyUser);

export default router;
