import { Request } from 'express';
import {
  Controller,
  UseGuards,
  Body,
  Post,
  Req,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() createWishDto: CreateWishDto,
    @Req() req: Request & { user: User },
  ) {
    return this.wishesService.create(createWishDto, req.user);
  }

  @UseGuards(JwtGuard)
  @Get(':wishId')
  findWishById(@Param('wishId') wishId: number) {
    return this.wishesService.findOne({ id: wishId });
  }

  @Get('last')
  findLastWishes() {
    return this.wishesService.find({}, 40, { createdAt: 'DESC' });
  }

  @Get('top')
  findTopWishes() {
    return this.wishesService.find({}, 10, { copied: 'DESC' });
  }

  @UseGuards(JwtGuard)
  @Patch('/:wishId')
  updateWish(
    @Param('wishId') wishId: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req: Request & { user: User },
  ) {
    return this.wishesService.updateOne(
      { id: wishId },
      updateWishDto,
      req.user,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('/:wishId')
  deleteWish(
    @Param('wishId') wishId: number,
    @Req() req: Request & { user: User },
  ) {
    return this.wishesService.removeOne({ id: wishId }, req.user);
  }

  @UseGuards(JwtGuard)
  @Post(':wishId/copy')
  async copyWish(
    @Param('wishId') wishId: number,
    @Req() req: Request & { user: User },
  ) {
    return this.wishesService.copyWish(wishId, req.user);
  }
}
