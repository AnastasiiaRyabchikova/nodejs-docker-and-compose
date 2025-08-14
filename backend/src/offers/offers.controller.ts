import { Request } from 'express';
import {
  Param,
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OffersService } from './offers.service';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}
  @Post()
  create(
    @Body() createOfferDto: CreateOfferDto,
    @Req() req: Request & { user: User },
  ) {
    return this.offersService.create(createOfferDto, req.user);
  }

  @Get()
  findLastWishes() {
    return this.offersService.find({});
  }

  @Get(':offerId')
  findWishById(@Param('offerId') offerId: number) {
    return this.offersService.findOne({ id: offerId });
  }
}
