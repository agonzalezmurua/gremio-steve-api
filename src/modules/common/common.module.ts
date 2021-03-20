import { Module } from "@nestjs/common";

import { ConfigProvider } from "./providers/config.provider";
import { LoggerService } from "./services/logger.service";

@Module({
  providers: [LoggerService, ConfigProvider],
  exports: [LoggerService, ConfigProvider],
})
export class CommonModule {}
