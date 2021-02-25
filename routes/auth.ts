import * as express from "express";
import AuthController from "_/controllers/handlers/auth";

const router = express.Router();

router.get("/osu", AuthController.requestAuthorization);
router.post("/osu/callback", AuthController.authenticateUser);

export default router;
