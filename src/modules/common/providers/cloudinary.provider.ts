import { v2 } from "cloudinary";

export const cloudinary = v2;

export async function configure(): Promise<void> {
  cloudinary.config({
    cloud_name: process.env.HOSTING_CLOUD_NAME,
    api_key: process.env.HOSTING_CLOUD_API_KEY,
    api_secret: process.env.HOSTING_CLOUD_API_SECRET,
  });
}
