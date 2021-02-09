import * as express from "express";
import JourneyController from "../controllers/journey";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const router = express.Router();

router.get("/", JourneyController.search);
router.post("/", ensureAuthenticated, JourneyController.create);

export default router;
