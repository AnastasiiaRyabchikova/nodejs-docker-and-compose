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
import { User } from 'src/users/entities/user.entity';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@UseGuards(JwtGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @Post()
  create(
    @Body() createWishDto: CreateWishlistDto,
    @Req() req: Request & { user: User },
  ) {
    return this.wishlistsService.create(createWishDto, req.user);
  }

  @Get()
  findWishlists() {
    return this.wishlistsService.find({}, ['owner', 'items']);
  }

  @Get(':wishlistId')
  findWishById(@Param('wishlistId') wishlistId: number) {
    return this.wishlistsService.findOne({ id: wishlistId });
  }

  @Patch('/:wishlistId')
  updateWishlist(
    @Param('wishlistId') wishId: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req: Request & { user: User },
  ) {
    return this.wishlistsService.updateOne(
      { id: wishId },
      updateWishlistDto,
      req.user,
    );
  }

  @Delete('/:wishlistId')
  deleteWish(
    @Param('wishlistId') wishId: number,
    @Req() req: Request & { user: User },
  ) {
    return this.wishlistsService.removeOne({ id: wishId }, req.user);
  }
}
