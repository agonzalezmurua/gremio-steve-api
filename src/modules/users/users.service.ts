import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserData } from "./models/user.data";

import { User } from "./models/user.entity";
import { UserInput } from "./models/user.input";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findByOsuId(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { osu_id: id } });
  }

  async findOneById(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async create(input: UserInput): Promise<User> {
    const user = new User();

    user.osu_id = input.osu_id;
    user.name = input.name;
    user.avatar_url = input.avatar_url;
    user.banner_url = input.banner_url;

    return this.usersRepository.save(user);
  }
}
