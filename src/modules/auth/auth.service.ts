import { Injectable } from "@nestjs/common";
import { User } from "../users/models";

import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async findUserFromOsuById(id: number): Promise<User> {
    const user = await this.usersService.findByOsuId(id);

    return user;
  }
}
