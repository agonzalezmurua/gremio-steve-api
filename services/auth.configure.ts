import { Router, Application, Request, Response, NextFunction } from "express";
import inject from "./internal/auth/inject";

/**
 * Configures a router with 'oauth' prefix that handles
 * app's authentication
 */
export async function configure(app: Application): Promise<void> {
  const router = Router();

  // Injects authentication funcitions into the general app scope
  app.use((req: Request, res: Response, next: NextFunction) => {
    inject(req);
    next();
  });

  app.use("/oauth", router);
}
