import mongoose = require("mongoose");

class BaseController<T extends mongoose.Document> {
  public readonly model: mongoose.Model<T>;

  constructor(model: mongoose.Model<T>) {
    this.model = model;
  }
}

export default BaseController;
