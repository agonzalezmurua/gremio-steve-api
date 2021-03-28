import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { OsuService } from "_/modules/osu/osu.service";
import { User } from "_/modules/users/models";

import { Journey } from "./model/journey.entity";
import { JourneyCreateInput } from "./model/journey.create.input";

@Injectable()
export class JourneysService {
  constructor(
    @InjectRepository(Journey) private journeysRepository: Repository<Journey>,
    private osuService: OsuService
  ) {}

  findAll(): Promise<Journey[]> {
    return this.journeysRepository.find();
  }

  async findOneById(id: number): Promise<Journey> {
    return this.journeysRepository.findOne(id);
  }

  async create(input: JourneyCreateInput, owner: User): Promise<Journey> {
    const osu_id = this.osuService.determineIdFromLink(input.osu_link);
    const isOsuIdUsed =
      (await this.journeysRepository.findOne({ where: { osu_id: osu_id } })) !==
      null;

    if (isOsuIdUsed) {
      throw new BadRequestException();
    }

    const journey = new Journey();
    const beatmapset = await this.osuService.findBeatmapsetById(osu_id);

    journey.artist = beatmapset.artist;
    journey.osu_link = input.osu_link;
    journey.title = beatmapset.title;
    journey.covers_banner = beatmapset.covers["cover@2x"];
    journey.covers_thumbnail = beatmapset.covers["list@2x"];
    journey.osu_id = osu_id;
    journey.organizer = owner;

    return this.journeysRepository.save(journey);
  }

  async deleteOneById(id: string): Promise<void> {
    const journey = await this.journeysRepository.findOne(id);

    if (!journey) {
      throw new NotFoundException();
    }

    await this.journeysRepository.delete({ id: journey.id });

    return;
  }
}
