import { Module } from "@nestjs/common";
import { CloudinaryService } from "./providers/cloudinary.provider";

import { LoggerService } from "./services/logger.service";

@Module({
  providers: [LoggerService, CloudinaryService],
  exports: [LoggerService, CloudinaryService],
})
export class CommonModule {}
