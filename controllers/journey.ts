import * as mongoose from "mongoose";
import { Request, Response } from "express";

import JourneySchema, { IJourneyDocument } from "../schemas/journey";
import BaseController from "./_base";
import JourneyModel from "../models/journey";
import {
  ApiOperationGet,
  ApiPath,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";

const Journey = mongoose.model("Journey", JourneySchema);

@ApiPath({
  path: "/journey",
  name: "Journeys",
})
class JourneyController extends BaseController<IJourneyDocument> {
  constructor() {
    super(Journey);
  }

  @ApiOperationGet({
    responses: {
      200: {
        model: "Journey",
        type: SwaggerDefinitionConstant.ARRAY,
      },
    },
  })
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
