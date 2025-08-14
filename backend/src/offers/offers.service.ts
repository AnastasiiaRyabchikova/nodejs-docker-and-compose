// offer.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User): Promise<Offer> {
    const wish = await this.wishesService.findOne({
      id: createOfferDto.itemId,
    });

    if (!wish) {
      throw new NotFoundException();
    }

    if (wish.raised + createOfferDto.amount > wish.price) {
      throw new BadRequestException();
    }

    const offer = this.offerRepository.create({
      ...createOfferDto,
      user,
      item: wish,
    });

    await this.wishesService.upRaised({ id: wish.id }, createOfferDto.amount);

    return this.offerRepository.save(offer);
  }

  findById(id: number): Promise<Offer | null> {
    return this.offerRepository.findOneBy({ id });
  }

  async findOne(query: FindOptionsWhere<Offer>): Promise<Offer | null> {
    return this.offerRepository.findOne({
      where: query,
    });
  }

  async findAll(): Promise<Offer[]> {
    return this.offerRepository.find();
  }

  async find(query: FindOptionsWhere<Offer>): Promise<Offer[]> {
    return this.offerRepository.find({
      where: query,
    });
  }

  async updateOne(
    query: FindOptionsWhere<Offer>,
    updateOfferDto: UpdateOfferDto,
  ): Promise<Offer | null> {
    const offer = await this.findOne(query);
    if (!offer) return null;

    Object.assign(offer, updateOfferDto);
    return this.offerRepository.save(offer);
  }

  async removeOne(query: FindOptionsWhere<Offer>): Promise<boolean> {
    const offer = await this.findOne(query);
    if (!offer) return false;

    await this.offerRepository.remove(offer);
    return true;
  }
}
