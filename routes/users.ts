import * as express from "express";
import UserController from "../controllers/users";

const router = express.Router();

router.get("/", UserController.searchUsers);

export default router;
