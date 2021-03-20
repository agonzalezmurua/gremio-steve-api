import { Body, Controller, Get, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JourneysService } from "./journeys.service";

import { Journey } from "./model/journey.entity";
import { JourneyInput } from "./model/journey.input";
import { JourneyData } from "./model/journey.data";

@ApiTags("journey")
@Controller("journeys")
export class JourneysController {
  constructor(private journeyService: JourneysService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: JourneyData })
  public async findAll(): Promise<JourneyData[]> {
    const journeys = await this.journeyService.findAll();

    return journeys.map((journey) => journey.build());
  }

  @Get(":id")
  @ApiResponse({ status: HttpStatus.OK, type: JourneyData })
  public async findById(@Param("id") id: string): Promise<JourneyData> {
    const journey = await this.journeyService.findOneById(id);
    return journey.build();
  }

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.CREATED, type: JourneyData })
  public async createOne(@Body() input: JourneyInput): Promise<JourneyData> {
    const journey = await this.journeyService.create(input);

    return journey.build();
  }
}
