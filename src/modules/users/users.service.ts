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

  async findAll(): Promise<UserData[]> {
    const users = await this.usersRepository.find();

    return users.map((user) => user.build());
  }

  async findOneById(id: string): Promise<UserData> {
    const user = await this.usersRepository.findOne(id);
    return user.build();
  }

  async create(input: UserInput): Promise<User> {
    const user = new User();

    user.name = input.name;

    return this.usersRepository.save(user);
  }
}
