import * as mongoose from "mongoose";
import { Request, Response } from "express";
import {
  ApiOperationGet,
  ApiOperationPost,
  ApiPath,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";

import BaseController from "./_base";

import Journey from "../models/journey";
import JourneySchema, { IJourney, IJourneyDocument } from "../schemas/journey";

const MongooseModel = mongoose.model("Journey", JourneySchema);

@ApiPath({
  path: "/journeys",
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

    MongooseModel.fuzzySearch(search as string)
      .select("-confidenceScore")
      .exec()
      .then((journeys) =>
        res.json(journeys.map((journey) => new Journey(journey)))
      );
  }

  @ApiOperationPost({
    parameters: {
      body: {
        model: "Journey",
      },
    },
    responses: {
      200: {
        model: "Journey",
        type: SwaggerDefinitionConstant.OBJECT,
      },
    },
    security: {
      ensureAuthenticated: [],
    },
  })
  public create(req: Request<null, null, IJourney>, res: Response) {
    const {
      artist,
      banner_url,
      beatmaps = [],
      metadata,
      modes = [],
    } = req.body;
    new MongooseModel({
      organized: req.user._id,
    })
      .save({ validateBeforeSave: true })
      .then((journey) => res.json(journey));
  }
}

export default new JourneyController();
