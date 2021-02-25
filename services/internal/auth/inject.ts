//
// This module exposes functions that are injected into
// the request object on the {service}.configure file
//
import { Request } from "express";
import { verifyJwtSignature } from "./identity";

/**
 * Injects into the request object utlity authentitacion functions
 * @param request Express' request object
 */
export default function inject(request: Request): void {
  request.isAuthenticated = function isAuthenticated() {
    const authorizationHeader = request.header("authorization");

    // Validate authentication token
    if (!authorizationHeader) {
      return false;
    }

    // Should follow the following structure
    // [String with value "Bearer", Signed JWT string]
    const [token_type, access_token] = authorizationHeader.split(" ");

    if (token_type !== "Bearer") {
      return false;
    }

    try {
      const payload = verifyJwtSignature(access_token);
      request.user = payload;
    } catch (err) {
      return false;
    }

    return true;
  };
}
