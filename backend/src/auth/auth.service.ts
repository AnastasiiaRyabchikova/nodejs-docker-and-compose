import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new NotFoundException();
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) {
      const result = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        username: user.username,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        wishes: user.wishes,
        wishlists: user.wishlists,
        offers: user.offers,
      };
      return result;
    }

    return null;
  }
}
