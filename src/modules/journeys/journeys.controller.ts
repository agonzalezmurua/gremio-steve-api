import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JourneysService } from "./journeys.service";

import { JourneyInput } from "./model/journey.input";
import { JourneyData } from "./model/journey.data";

import { LoggerService } from "_/modules/common/services/logger.service";
import { User } from "_/modules/users/models";

@ApiTags("journey")
@Controller("journeys")
export class JourneysController {
  constructor(
    private journeyService: JourneysService,
    private logger: LoggerService
  ) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: JourneyData })
  public async findAll(): Promise<JourneyData[]> {
    const journeys = await this.journeyService.findAll();
    this.logger.info(journeys);

    return journeys.map((journey) => journey.build());
  }

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.CREATED, type: JourneyData })
  public async createOne(
    @Body() input: JourneyInput,
    @Req() request: Express.Request
  ): Promise<JourneyData> {
    const journey = await this.journeyService.create(
      input,
      request.user as User
    );

    return journey.build();
  }

  @Get(":id")
  @ApiResponse({ status: HttpStatus.OK, type: JourneyData })
  public async findOneById(@Param("id") id: string): Promise<JourneyData> {
    const journey = await this.journeyService.findOneById(id);
    return journey.build();
  }
}
