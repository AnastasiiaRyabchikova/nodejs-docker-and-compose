import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, FindOptionsOrder } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, user: User): Promise<Wish> {
    const wish = this.wishRepository.create({
      ...createWishDto,
      owner: user,
    });
    return this.wishRepository.save(wish);
  }

  async findOne(query: FindOptionsWhere<Wish>): Promise<Wish | null> {
    return this.wishRepository.findOne({
      where: query,
      relations: ['owner', 'offers', 'wishlists'],
    });
  }

  async find(
    query: FindOptionsWhere<Wish>,
    take: number,
    order: FindOptionsOrder<Wish>,
  ): Promise<Wish[]> {
    return this.wishRepository.find({
      where: query,
      take,
      order,
      relations: ['owner'],
    });
  }

  async updateOne(
    query: FindOptionsWhere<Wish>,
    updateWishDto: UpdateWishDto,
    user: User,
  ): Promise<Wish | null> {
    const wish = await this.findOne(query);

    if (!wish) {
      throw new NotFoundException();
    }

    if (wish.owner.id !== user.id) {
      throw new ForbiddenException();
    }

    if (Array.isArray(wish.offers) && wish.offers.length > 0) {
      throw new ForbiddenException();
    }

    Object.assign(wish, updateWishDto);
    return this.wishRepository.save(wish);
  }

  async copyWish(wishId: number, user: User) {
    const wish = await this.findOne({ id: wishId });

    if (!wish) {
      throw new NotFoundException();
    }

    const createWishDto = {
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
    };

    Object.assign(wish, { copied: wish.copied + 1 });
    await this.wishRepository.save(wish);
    return this.create(createWishDto, user);
  }

  async upRaised(query: FindOptionsWhere<Wish>, amount: number) {
    const wish = await this.findOne(query);

    if (!wish) {
      throw new NotFoundException();
    }

    Object.assign(wish, { raised: wish.raised + amount });
    return this.wishRepository.save(wish);
  }

  async removeOne(query: FindOptionsWhere<Wish>, user: User) {
    const wish = await this.findOne(query);
    if (!wish) {
      throw new NotFoundException();
    }

    if (wish.owner.id !== user.id) {
      throw new ForbiddenException();
    }

    await this.wishRepository.remove(wish);
  }
}
