import * as express from "express";
import AuthController from "_/controllers/handlers/auth";

const router = express.Router();

router.get("/osu", AuthController.redirectToOsuOauth);
router.post("/osu/callback", AuthController.authenticateUser);

router.get("/app", AuthController.issueAppAuthentication);
router.get("/refresh", AuthController.refreshToken);

export default router;
