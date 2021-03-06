import { Request, Response } from "express";
import {
  ApiOperationDelete,
  ApiOperationGet,
  ApiOperationPost,
  ApiPath,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";

import Journey from "_/models/journey";
import { IJourney, JourneyStatus } from "_/schemas/journey";
import authenticationResponses from "_/constants/swagger.authenticationResponses";
import { UnauthorizedError } from "_/utils/errors";
import UserMongoose from "_/controllers/mongo/user";
import JourneyMongoose from "_/controllers/mongo/journey";
import cloudinary from "_/services/internal/cloudinary";
import { isBase64, removeDataUrlDeclaration } from "_/utils/base64";

const image_transformations = {
  banner: {
    width: 900,
    height: 250,
  },
  thumbnail: {
    width: 250,
    height: 250,
  },
};

@ApiPath({
  path: "/journeys",
  name: "Journeys",
})
class JourneyController {
  @ApiOperationGet({
    description: "Search a list of journeys based on a string",
    summary: "Serach for journeys",
    parameters: {
      query: {
        search: {
          type: SwaggerDefinitionConstant.STRING,
          allowEmptyValue: true,
          required: false,
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
  public async searchJourneys(req: Request, res: Response) {
    const {
      query: { search = "" },
    } = req;

    const journeys = await JourneyMongoose.fuzzySearch(search as string)
      .select("-confidenceScore")
      .populate({ path: "organizer", select: "-journeys -queue" })
      .exec();

    res.json(journeys.map((journey) => new Journey(journey)));
  }

  @ApiOperationGet({
    path: "/mine",
    description: "Get the journeys that were organized by the current user",
    summary: "Get my journeys",
    parameters: {
      query: {
        status: {
          type: SwaggerDefinitionConstant.STRING,
          required: false,
          default: undefined,
        },
      },
    },
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
  public async getMyJourneys(
    req: Request<unknown, unknown, unknown, { status?: JourneyStatus }>,
    res: Response
  ) {
    const journeys = await JourneyMongoose.find(
      req.query.status
        ? {
            organizer: req.user.id,
            status: req.query.status,
          }
        : {
            organizer: req.user.id,
          }
    )
      .populate("organizer")
      .exec();

    res.json(journeys.map((journey) => new Journey(journey)));
  }

  @ApiOperationGet({
    path: "/queue",
    description: "Get journeys that were added into the user's queue",
    summary: "Get my queue",
    security: {
      bearerAuth: [],
    },
    responses: {
      200: {
        type: SwaggerDefinitionConstant.ARRAY,
        model: "Journey",
      },
    },
  })
  public async getMyQueue(req: Request, res: Response) {
    const { queue } = await UserMongoose.findById(req.user.id)
      .select("queue")
      .exec();

    const journeys = await JourneyMongoose.find({
      _id: {
        $in: queue,
      },
    })
      .populate("organizer")
      .exec();

    res.json(journeys.map((journey) => new Journey(journey)));
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
  public async getOneJourneyById(req: Request<{ id: string }>, res: Response) {
    const journey = await JourneyMongoose.findById(req.params.id)
      .populate("organizer")
      .exec();

    res.json(journey);
  }

  @ApiOperationPost({
    description: "Create a new journey",
    parameters: {
      body: {
        name: "journey",
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
  public async createOneJourney(
    { body, user }: Request<null, null, { journey: IJourney }>,
    res: Response
  ) {
    const {
      title,
      artist,
      thumbnail_url: thumbnail,
      banner_url: banner,
      metadata: { bpm, duration, genre, closure },
      description,
      is_private,
      beatmaps = [],
      osu_link,
    } = body.journey;

    let thumbnail_url: string;
    let banner_url: string;

    if (isBase64(thumbnail)) {
      await cloudinary.uploader
        .upload(removeDataUrlDeclaration(thumbnail), {
          transformation: image_transformations.thumbnail,
          async: true,
        })
        .then((response) => {
          thumbnail_url = response.url;
        });
    }

    if (isBase64(banner)) {
      await cloudinary.uploader
        .upload(removeDataUrlDeclaration(banner), {
          transformation: image_transformations.banner,
          async: true,
        })
        .then((response) => {
          banner_url = response.url;
        });
    }

    const journey = await new JourneyMongoose({
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
    }).save({ validateBeforeSave: true });
    await journey.populate("organizer").execPopulate();

    res.json(new Journey(journey));
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
      200: {
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
  public async deleteOneJourneyById(
    req: Request<{ id: string }>,
    res: Response
  ) {
    const journey = await JourneyMongoose.findById(req.params.id)
      .populate("organizer")
      .exec();

    if (!journey) {
      return res.status(404);
    }

    if (journey.organizer.id !== req.user.id) {
      throw new UnauthorizedError();
    }

    await journey.delete();

    res.status(204);
    res.send();
  }
}

export default new JourneyController();
