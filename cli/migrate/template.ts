import * as DB from "../controllers/mongo";

import { configure } from "../services/database.configure";

/* Code your update script here! */
export const up = async (): Promise<void> => {
  await configure();
};

/* Code you downgrade script here! (if applicable) */
export const down = async (): Promise<void> => {
  await configure();
};
