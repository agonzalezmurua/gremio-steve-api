import { Router, Application, Request, Response, NextFunction } from "express";
import { verifyJwt } from "_/services/oauth/authentication";
import {
  requestAuthorization as osuAuthorization,
  handleAuthentication as osuAuthentication,
} from "_/services/oauth/providers/osu";

/**
 * Configures a router with 'oauth' prefix that handles
 * app's authentication
 */
export async function configure(app: Application): Promise<void> {
  const router = Router();

  router.get("/osu", osuAuthorization);
  router.post("/osu/token", osuAuthentication);

  app.use((req: Request, res: Response, next: NextFunction) => {
    req.isAuthenticated = function (): boolean {
      const authorization = req.header("authorization");

      if (!authorization) {
        return false;
      }

      const [token_type, access_token] = authorization.split(" ");

      if (token_type !== "Bearer") {
        return false;
      }

      try {
        const payload = verifyJwt(access_token);
        req.user = payload;
      } catch (err) {
        return false;
      }

      return true;
    };
    next();
  });

  app.use("/oauth", router);
}
