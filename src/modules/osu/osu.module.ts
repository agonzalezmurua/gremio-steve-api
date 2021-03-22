import { HttpModule, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OsuService } from "./osu.service";

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get("osu.url"),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [OsuService],
  exports: [OsuService],
})
export class OsuModule {}
