import * as express from "express";
import BeatmapController from "../controllers/beatmaps";

const router = express.Router();

router.get("/", BeatmapController.search);

export default router;
