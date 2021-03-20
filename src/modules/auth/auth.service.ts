import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";

import { User } from "../users/models";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(@Inject() private usersService: UsersService) {}

  async findUserFromOsuById(id: string): Promise<User> {
    const user = await this.usersService.findByOsuId(id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
