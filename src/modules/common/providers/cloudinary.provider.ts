import { v2 as Cloudinary } from "cloudinary";

export class CloudinaryService {
  constructor() {
    this._cloudinary = Cloudinary;
    Cloudinary.config({
      cloud_name: process.env.HOSTING_CLOUD_NAME,
      api_key: process.env.HOSTING_CLOUD_API_KEY,
      api_secret: process.env.HOSTING_CLOUD_API_SECRET,
    });
  }

  private _cloudinary: typeof Cloudinary;

  public get cloudinary(): typeof Cloudinary {
    return this._cloudinary;
  }
}
