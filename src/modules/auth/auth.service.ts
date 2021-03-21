import { Injectable, UnauthorizedException } from "@nestjs/common";

import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async findUserFromOsuById(id: number): Promise<unknown> {
    const user = await this.usersService.findByOsuId(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
