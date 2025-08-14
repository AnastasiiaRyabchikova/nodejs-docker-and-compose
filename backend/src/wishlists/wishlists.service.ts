import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, In } from 'typeorm';
import { WishesService } from '../wishes/wishes.service';
import { User } from '../users/entities/user.entity';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const wishes = await this.wishesService.find(
      {
        id: In(createWishlistDto.itemsId),
      },
      10,
      {},
    );
    const wishlist = this.wishlistRepository.create({
      ...createWishlistDto,
      owner: user,
      items: wishes,
    });
    return this.wishlistRepository.save(wishlist);
  }

  async findOne(query: FindOptionsWhere<Wishlist>): Promise<Wishlist | null> {
    return this.wishlistRepository.findOne({
      where: query,
      relations: ['owner', 'items'],
    });
  }

  async find(
    query: FindOptionsWhere<Wishlist>,
    relations: string[],
  ): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      where: query,
      relations,
    });
  }

  async updateOne(
    query: FindOptionsWhere<Wishlist>,
    updateWishlistDto: UpdateWishlistDto,
    user: User,
  ): Promise<Wishlist | null> {
    const wishlist = await this.findOne(query);

    if (!wishlist) {
      throw new NotFoundException();
    }

    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException();
    }

    const wishes = await this.wishesService.find(
      {
        id: In(updateWishlistDto.itemsId),
      },
      10,
      {},
    );

    return this.wishlistRepository.save({
      ...wishlist,
      ...updateWishlistDto,
      items: wishes,
    });
  }

  async removeOne(query: FindOptionsWhere<Wishlist>, user: User) {
    const wishlist = await this.findOne(query);
    if (!wishlist) {
      throw new NotFoundException();
    }

    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException();
    }

    await this.wishlistRepository.remove(wishlist);
  }
}
