import * as mongoose from "mongoose";
import { Request, Response } from "express";
import {
  ApiOperationGet,
  ApiPath,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";

import BaseController from "./_base";

import Beatmap from "../models/beatmap";
import BeatmapSchema, { IBeatmapDocument } from "../schemas/beatmap";

const MongooseModel = mongoose.model("Beatmap", BeatmapSchema);

@ApiPath({
  path: "/beatmaps",
  name: "Beatmaps",
})
class BeatmapController extends BaseController<IBeatmapDocument> {
  constructor() {
    super(MongooseModel);
  }

  @ApiOperationGet({
    responses: {
      200: {
        model: "Beatmap",
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
      .then((beatmaps) =>
        res.json(beatmaps.map((beatmap) => new Beatmap(beatmap)))
      );
  }
}

export default new BeatmapController();
