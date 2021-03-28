import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JourneysService } from "./journeys.service";

import { JourneyCreateInput } from "./model/journey.create.input";
import { JourneyData } from "./model/journey.data";

import { LoggerService } from "_/modules/common/services/logger.service";
import { User } from "_/modules/users/models";
import { JwtAuthGuard } from "../auth/jwt-autj.guard";

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
    return journeys.map((journey) => journey.build());
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.CREATED, type: JourneyData })
  public async createOne(
    @Body() input: JourneyCreateInput,
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
  public async findOneById(@Param("id") id: number): Promise<JourneyData> {
    const journey = await this.journeyService.findOneById(id);

    this.logger.info(journey);
    if (!journey) {
      throw new NotFoundException();
    }

    return journey.build();
  }

  // @Delete(":id")
  // @ApiResponse({ status: HttpStatus.NO_CONTENT })
  // @ApiResponse({ status: HttpStatus.NOT_FOUND })
  // public async deleteOneById(@Param("id") id: string): Promise<void> {
  //   this.journeyService.deleteOneById(id);
  // }
}
