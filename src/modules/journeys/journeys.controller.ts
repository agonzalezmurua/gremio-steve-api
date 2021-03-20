import { Body, Controller, Get, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

import { JourneysService } from "./journeys.service";

import { Journey } from "./model/journey.entity";
import { JourneyInput } from "./model/journey.input";
import { JourneyData } from "./model/journey.data";

@ApiTags("journey")
@Controller("journeys")
export class JourneysController {
  constructor(private journeyService: JourneysService) {}

  @Get()
  public async findAll(): Promise<Journey[]> {
    return this.journeyService.findAll();
  }

  @Get(":id")
  public async findById(@Param("id") id: string): Promise<Journey> {
    return this.journeyService.findOneById(id);
  }

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: JourneyData })
  public async createOne(@Body() input: JourneyInput): Promise<JourneyData> {
    const journey = await this.journeyService.create(input);

    return journey.build();
  }
}
