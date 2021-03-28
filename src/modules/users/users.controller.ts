import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "_/modules/auth/jwt-autj.guard";

import { ActivityService } from "_/modules/activity/activity.service";
import { ActivityData } from "_/modules/activity/models/activity.data";

import { UsersService } from "./users.service";
import { UserData } from "./models/user.data";
import { UserUpdateInput } from "./models/user.update.input";
import { JourneyData } from "../journeys/model";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(
    private userService: UsersService,
    private activityService: ActivityService
  ) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, isArray: true, type: UserData })
  public async search(): Promise<UserData[]> {
    const users = await this.userService.findAll();

    return users.map((user) => user.build());
  }

  @Get("@me")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.OK, type: UserData })
  public async getMyself(@Req() request): Promise<UserData> {
    const user = await this.userService.findOneById(request.user.id);
    return user.build();
  }

  @Get("@me/activity-feed")
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.OK, type: ActivityData, isArray: true })
  public async getMyActivityFeed(@Req() request): Promise<ActivityData[]> {
    const followed = await this.userService.getFollowedUsers(request.user.id);
    const feeds = await this.activityService.findManyUsersActivity(
      followed.map(({ id }) => id)
    );

    return feeds.map((feed) => feed.build());
  }

  @Put("@me/queue/:journey_id")
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.OK })
  public async addJourneyToMyQueue(
    @Param("journey_id") journeyId: number,
    @Req() request
  ): Promise<void> {
    await this.userService.addJourneyToUserQueue(journeyId, request.user.id);
  }

  @Delete("@me/queue/:journey_id")
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.OK })
  public async removeJourneyFromMyQueue(
    @Param("journey_id") journeyId: number,
    @Req() request
  ): Promise<void> {
    await this.userService.removeJourneyFromUserQueue(
      journeyId,
      request.user.id
    );
  }

  @Get("@me/queue")
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.OK, isArray: true, type: JourneyData })
  public async getMyQueue(@Req() request) {
    const queue = await this.userService.getUserQueue(request.user.id);
    return queue.map((journey) => journey.build());
  }

  @Get(":id")
  @ApiResponse({ status: HttpStatus.OK, type: UserData })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  public async getOneById(@Param("id") id: number): Promise<UserData> {
    const user = await this.userService.findOneById(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user.build();
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.OK, type: UserData })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  public async updateOneById(
    @Param("id") id: number,
    @Body() payload: UserUpdateInput,
    @Req() req
  ): Promise<UserData> {
    const isOwnEntry =
      (await this.userService.findOneById(req.user.id)).id === id;

    if (isOwnEntry === false) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.updateOne(id, payload);

    return user.build();
  }

  @Get(":id/activity")
  @ApiResponse({ status: HttpStatus.OK, type: ActivityData, isArray: true })
  public async getUserActivity(@Param("id") id: number) {
    if ((await this.userService.exists(id)) === false) {
      throw new NotFoundException();
    }
    const activities = await this.activityService.findUserActivity(id);

    return activities.map((activity) => activity.build());
  }
}
