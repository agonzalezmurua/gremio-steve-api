import consola from "consola";
import { v2 } from "cloudinary";

import prefixes from "_/common/constants/consola.prefixes";

export const cloudinary = v2;

export async function configure(): Promise<void> {
  try {
    cloudinary.config({
      cloud_name: process.env.HOSTING_CLOUD_NAME,
      api_key: process.env.HOSTING_CLOUD_API_KEY,
      api_secret: process.env.HOSTING_CLOUD_API_SECRET,
    });
    consola.success(prefixes.hosting, "Cloudinary configured");
  } catch (error) {
    consola.error(prefixes.hosting, "Cloudinary failed to configure", error);
    throw error;
  }
}
