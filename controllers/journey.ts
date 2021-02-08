import mongoose from "mongoose";
import { Request, Response } from "express";

import JourneySchema, { IJourneyDocument } from "../schemas/journey";
import BaseController from "./_base";
import JourneyModel from "../models/journey";

const Journey = mongoose.model("Journey", JourneySchema);

class JourneyController extends BaseController<IJourneyDocument> {
  constructor() {
    super(Journey);
  }
  public search(req: Request, res: Response) {
    const {
      query: { search = "" },
    } = req;

    this.model
      .fuzzySearch(search as string)
      .select("-confidenceScore")
      .exec()
      .then((journeys) =>
        res.json(journeys.map((journey) => new JourneyModel(journey)))
      );
  }
}

export default new JourneyController();
