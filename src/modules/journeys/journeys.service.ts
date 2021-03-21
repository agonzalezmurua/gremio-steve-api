import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/models";

import { Journey } from "./model/journey.entity";
import { JourneyInput } from "./model/journey.input";

@Injectable()
export class JourneysService {
  constructor(
    @InjectRepository(Journey) private journeysRepository: Repository<Journey>
  ) {}

  findAll(): Promise<Journey[]> {
    return this.journeysRepository.find();
  }

  findOneById(id: string): Promise<Journey> {
    return this.journeysRepository.findOne(id);
  }

  create(input: JourneyInput, owner: User): Promise<Journey> {
    const journey = new Journey();

    journey.artist = input.artist;
    journey.osu_link = input.osu_link;
    journey.title = input.title;
    journey.covers_banner = input.covers.banner;
    journey.covers_thumbnail = input.covers.thumbnail;
    journey.organizer = owner;

    return this.journeysRepository.save(journey);
  }
}
