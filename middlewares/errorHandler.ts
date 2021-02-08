import consola from "consola";

/**
 * Generic error handler for every appended request
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export default function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const error: { [key: string]: any } = {
    message: err.message || "NO.MESSAGE",
    name: err.name,
  };

  switch (err.name) {
    case "ValidationError":
      error.validations = err.errors;
      res.status(400);
      break;
    case "UnauthenticatedError":
      res.status(401);
      break;
    case "UnauthorizedError":
      res.status(403);
      break;
    default:
      res.status(500);
      break;
  }

  consola.error(error);

  res.json({
    error: error,
  });
}
