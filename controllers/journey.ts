import * as mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import {
  ApiOperationDelete,
  ApiOperationGet,
  ApiOperationPost,
  ApiPath,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";

import BaseController from "./_base";

import Journey from "_/models/journey";
import JourneySchema, { IJourney, IJourneyDocument } from "_/schemas/journey";
import authenticationResponses from "_/constants/swagger.authenticationResponses";
import { UnauthorizedError } from "_/utils/errors";

const Model = mongoose.model("Journey", JourneySchema);

@ApiPath({
  path: "/journeys",
  name: "Journeys",
})
class JourneyController extends BaseController<IJourneyDocument> {
  constructor() {
    super(Model);
  }

  @ApiOperationGet({
    description: "Search a list of journeys based on a string",
    summary: "Serach for journeys",
    parameters: {
      query: {
        search: {
          type: SwaggerDefinitionConstant.STRING,
          allowEmptyValue: true,
        },
      },
    },
    responses: {
      200: {
        model: "Journey",
        type: SwaggerDefinitionConstant.ARRAY,
      },
    },
  })
  public searchJourneys(req: Request, res: Response, next: NextFunction) {
    const {
      query: { search = "" },
    } = req;

    Model.fuzzySearch(search as string)
      .select("-confidenceScore")
      .populate({ path: "organizer", select: "-journeys -queue" })
      .exec()
      .then((journeys) =>
        res.json(journeys.map((journey) => new Journey(journey)))
      )
      .catch((error) => {
        next(error);
      });
  }

  @ApiOperationGet({
    path: "/mine",
    description: "Get the journeys that were organized by the current user",
    summary: "Get my journeys",
    security: {
      bearerAuth: [],
    },
    responses: {
      200: {
        model: "Journey",
        type: SwaggerDefinitionConstant.ARRAY,
      },
    },
  })
  public getMyJourneys({ user }: Request, res: Response, next: NextFunction) {
    Model.find({ organizer: user.id })
      .exec()
      .then((journeys) => res.json(journeys.map((j) => new Journey(j))))
      .catch((e) => next(e));
  }

  @ApiOperationGet({
    path: "/:id",
    description: "Find one journey based on ID",
    summary: "Find one by id",
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
  public getOneJourneyById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    Model.findById(req.params.id)
      .populate("organizer")
      .exec()
      .then((journey) => res.json(journey))
      .catch((error) => next(error));
  }

  @ApiOperationPost({
    description: "Create a new journey",
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
  public createOneJourney(
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
      description,
      is_private,
      beatmaps = [],
      osu_link,
    } = body;
    new Model({
      organizer: user.id,
      artist,
      banner_url,
      title,
      thumbnail_url,
      beatmaps,
      metadata: {
        bpm: bpm,
        duration: duration,
        genre: genre,
        closure: closure,
      },
      is_private,
      osu_link,
      description,
    })
      .save({ validateBeforeSave: true })
      .then((journey) => res.json(new Journey(journey)))
      .catch((error) => next(error));
  }

  @ApiOperationDelete({
    description: "Delete a journey based on id",
    summary: "Delete a journey",
    path: "/:id",
    parameters: {
      path: {
        id: {
          type: SwaggerDefinitionConstant.STRING,
          description: "Journey's id",
        },
      },
    },
    responses: {
      204: {
        description: "The journey was deleted succesfully",
      },
      404: {
        description: "The journey could not be found",
      },
      ...authenticationResponses,
    },
    security: {
      ensureAuthenticated: [],
    },
  })
  public deleteOneJourneyById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    Model.findById(req.params.id)
      .populate("organizer")
      .exec()
      .then((journey) => {
        if (!journey) {
          return res.status(404);
        }
        if (journey.organizer.id === req.user.id) {
          res.status(204);
          return journey.delete();
        }
        throw new UnauthorizedError();
      })
      .then(() => {
        res.json();
      })
      .catch((error) => next(error));
  }
}

export default new JourneyController();
