import Express from "express";
import User from "../providers/database/user";

const router = Express.Router();

router.get("/", async (req, res) => {
  const {
    query: { search },
  } = req;

  const users = await User.fuzzySearch(search as string)
    .select("-confidenceScore")
    .exec();

  res.json(users);
});

export default router;
