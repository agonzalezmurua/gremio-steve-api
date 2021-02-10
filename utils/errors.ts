export class UnauthenticatedError extends Error {
  constructor() {
    super();
    this.name = "UnauthenticatedError";
    this.message = "Failed to authenticate";
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super();
    this.name = "UnauthorizedError";
    this.message = "Not allowed to perform this action";
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super();
    this.name = "ValidationError";
    this.message = message;
  }
}
