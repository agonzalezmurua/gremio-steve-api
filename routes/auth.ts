import * as express from "express";
import AuthController from "_/controllers/auth";

const router = express.Router();

router.get("/osu", AuthController.requestAuthorization);
router.post("/osu/callback", AuthController.requestAuthorization);

export default router;
