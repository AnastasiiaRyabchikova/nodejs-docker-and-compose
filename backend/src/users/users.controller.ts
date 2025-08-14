import {
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
  Body,
  Param,
  Post,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { WishesService } from '../wishes/wishes.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}
  @Get('me')
  me(@Req() req: Request & { user: User }) {
    return req.user;
  }

  @Patch('me')
  patchMe(
    @Req() req: Request & { user: User },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateOne({ id: req.user.id }, updateUserDto);
  }

  @Get('me/wishes')
  findMyWishes(@Req() req: Request & { user: User }) {
    return this.wishesService.find({ owner: { id: req.user.id } }, 100, {});
  }

  @Get(':username')
  async findUser(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Get(':username/wishes')
  async findUserWishes(@Param('username') username: string) {
    return this.usersService.findUserWishes(username);
  }

  @Post('find')
  findUsers(@Body() query: { query: string }) {
    return this.usersService.findByEmailOrUsername(query.query);
  }
}
