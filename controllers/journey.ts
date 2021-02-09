import * as mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
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
  public search(req: Request, res: Response, next: NextFunction) {
    const {
      query: { search = "" },
    } = req;

    MongooseModel.fuzzySearch(search as string)
      .select("-confidenceScore")
      .exec()
      .then((journeys) =>
        res.json(journeys.map((journey) => new Journey(journey)))
      )
      .catch((error) => {
        next(error);
      });
  }

  @ApiOperationGet({
    path: "/:id",
    parameters: {
      path: {
        id: { type: SwaggerDefinitionConstant.STRING },
      },
    },
    responses: {
      200: {
        model: "Journey",
      },
      404: {},
    },
  })
  public getOneById(
    { params: { id } }: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    MongooseModel.findById(id)
      .populate("organizer beatmaps")
      .exec()
      .then((journey) => res.json(journey))
      .catch((error) => next(error));
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
  public create(
    { body, user }: Request<null, null, IJourney>,
    res: Response,
    next: NextFunction
  ) {
    const {
      title,
      artist,
      thumbnail_url,
      banner_url,
      metadata: { bpm, duration, genre, closure },
      modes = [],
      description,
      is_private,
      beatmaps = [],
      osu_link,
    } = body;
    new MongooseModel({
      organizer: user._id,
      artist,
      banner_url,
      title,
      thumbnail_url,
      beatmaps,
      metadata: {
        bpm: bpm,
        duration: duration,
        genre: genre,
        closure: closure ? new Date(closure) : null,
      },
      modes,
      is_private,
      osu_link,
      description,
    })
      .save({ validateBeforeSave: true })
      .then((journey) => res.json(journey))
      .catch((error) => next(error));
  }
}

export default new JourneyController();
