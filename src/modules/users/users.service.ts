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

  async findByOsuId(id: string): Promise<User> {
    return this.usersRepository.findOne({ where: { osu_id: id } });
  }

  async findOneById(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async create(input: UserInput): Promise<User> {
    const user = new User();

    user.name = input.name;

    return this.usersRepository.save(user);
  }
}
