import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserData } from "./models/user.data";

import { User } from "./models/user.entity";
import { UserCreateInput } from "./models/user.create.input";
import { UserUpdateInput } from "./models/user.update.input";
import { JourneysService } from "../journeys/journeys.service";
import _ = require("lodash");

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private journeyService: JourneysService
  ) {}

  public async exists(id: number): Promise<boolean> {
    const user = await this.usersRepository.findOne(id);
    return user !== undefined;
  }

  public async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  public async findByOsuId(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { osu_id: id } });
  }

  public async findOneById(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  public async createOne(input: UserCreateInput): Promise<User> {
    const user = new User();

    user.osu_id = input.osu_id;
    user.name = input.name;
    user.avatar_url = input.avatar_url;
    user.banner_url = input.banner_url;

    return this.usersRepository.save(user);
  }

  public async updateOne(id: number, input: UserUpdateInput): Promise<User> {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    user.avatar_url = input.avatar_url || user.avatar_url;
    user.banner_url = input.banner_url || user.banner_url;
    user.description = input.description || user.description;
    user.email = input.email || user.email;
    user.is_available =
      typeof input.is_available === "boolean"
        ? input.is_available
        : user.is_available;
    user.name = input.name || user.email;

    await this.usersRepository.save(user);

    return user;
  }

  public async addJourneyToUserQueue(
    journeyId: number,
    userId: number
  ): Promise<void> {
    const user = await this.usersRepository.findOne(userId, {
      relations: ["queue"],
    });
    const journey = await this.journeyService.findOneById(journeyId);

    if (!journey) {
      throw new BadRequestException("Journey does not exist");
    }

    if (user.queue.find(({ id }) => (id === journeyId) !== undefined)) {
      user.queue = [...user.queue, journey];
      await this.usersRepository.save(user);
    }
  }

  public async removeJourneyFromUserQueue(
    journeyId: number,
    userId: number
  ): Promise<void> {
    const user = await this.usersRepository.findOne(userId, {
      relations: ["queue"],
    });

    const queue = _.remove(user.queue, ({ id }) => id === journeyId);

    user.queue = queue;

    await this.usersRepository.save(user);
  }

  public async getUserQueue(id: number) {
    const user = await this.usersRepository.findOne(id, {
      relations: ["queue"],
    });

    return user.queue;
  }

  public async getFollowedUsers(id: number): Promise<User[]> {
    const [user] = await this.usersRepository.find({
      where: { id: id },
      relations: ["following"],
    });

    return user.following;
  }

  public async getFollowingUsers(id: number): Promise<User[]> {
    const [user] = await this.usersRepository.find({
      where: { id: id },
      relations: ["followed"],
    });

    return user.followers;
  }
}
