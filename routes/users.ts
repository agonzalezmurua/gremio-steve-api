import express from "express";
import UserController from "../controllers/users";

const router = express.Router();

router.get("/users", UserController.searchUser);

export default router;
