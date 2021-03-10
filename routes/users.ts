import * as express from "express";
import UserController from "_/controllers/handlers/users";
import ensureAuthenticated from "_/middlewares/ensureAuthenticated";

const router = express.Router();

router.get("/", UserController.searchUsers);
router.get<{ id: string }>("/:id", UserController.getOneUserById);
router.get("/myself", ensureAuthenticated, UserController.getMyUser);
router.patch<{ id: string }>(
  "/:id/notification/preferences",
  ensureAuthenticated,
  UserController.updateUserNotificationPreferences
);
router.get(
  "/:id/activity_feed",
  ensureAuthenticated,
  UserController.getUserActivityFeed
);

export default router;
