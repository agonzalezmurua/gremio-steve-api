import * as mongoose from "mongoose";
import { Request, Response } from "express";
import {
  ApiOperationGet,
  ApiPath,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";

import BaseController from "./_base";

import Journey from "../models/journey";
import JourneySchema, { IJourneyDocument } from "../schemas/journey";

const MongooseModel = mongoose.model("Journey", JourneySchema);

@ApiPath({
  path: "/journey",
  name: "Journeys",
})
class JourneyController extends BaseController<IJourneyDocument> {
  constructor() {
    super(MongooseModel);
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
        res.json(journeys.map((journey) => new Journey(journey)))
      );
  }
}

export default new JourneyController();
