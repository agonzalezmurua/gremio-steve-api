import * as express from "express";
import JourneyController from "_/controllers/journey";
import ensureAuthenticated from "_/middlewares/ensureAuthenticated";

const router = express.Router();

router.get("/", JourneyController.searchJourneys);
router.post("/", ensureAuthenticated, JourneyController.createOneJourney);
router.get("/mine", ensureAuthenticated, JourneyController.getMyJourneys);

router.get("/:id", JourneyController.getOneJourneyById);
router.delete(
  "/:id",
  ensureAuthenticated,
  JourneyController.deleteOneJourneyById
);

export default router;
