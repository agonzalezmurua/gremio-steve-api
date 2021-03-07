import { IJourneyDocument } from "_/schemas/journey";
import * as DB from "../controllers/mongo";

import { configure } from "../services/database.configure";

/* Code your update script here! */
export const up = async (): Promise<void> => {
  await configure();

  let journey: IJourneyDocument;
  for await (journey of DB.Journey.find({
    banner_url: { $exists: true },
    thumbnail_url: { $exists: true },
  }).cursor()) {
    const covers = {
      banner: journey["_doc"]["banner_url"],
      thumbnail: journey["_doc"]["thumbnail_url"],
    };

    journey.set("covers", covers);

    journey.set("banner_url", undefined); // Delete the field from the document
    journey.set("thumbnail_url", undefined); // Delete the field from the document

    await journey.save({ validateBeforeSave: false });
  }
};

/* Code you downgrade script here! (if applicable) */
export const down = async (): Promise<void> => {
  await configure();
  let journey: IJourneyDocument;
  for await (journey of DB.Journey.find({
    covers: {
      $exists: true,
    },
  }).cursor()) {
    journey.set("banner_url", journey["_doc"]["covers"]["banner"]);
    journey.set("thumbnail_url", journey["_doc"]["covers"]["thumbnail"]);
    journey.set("covers", undefined); // Delete the field from the document

    const document = await journey.save({ validateBeforeSave: false });
    console.info(document);
  }
};
