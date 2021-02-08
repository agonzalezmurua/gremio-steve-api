import * as express from "express";
import JourneyController from "../controllers/journey";

const router = express.Router();

router.get("/", JourneyController.search);

export default router;
