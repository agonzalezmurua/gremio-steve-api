import * as express from "express";
import JourneyController from "../controllers/journey";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const router = express.Router();

router.get("/", JourneyController.search);
router.post("/", ensureAuthenticated, JourneyController.create);
router.get("/mine", ensureAuthenticated, JourneyController.getMines);

router.get("/:id", JourneyController.getOneById);
router.delete("/:id", ensureAuthenticated, JourneyController.deleteOneById);

export default router;
