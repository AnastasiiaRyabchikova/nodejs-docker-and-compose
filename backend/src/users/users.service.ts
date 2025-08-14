import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private wishesService: WishesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (
      await this.usersRepository.findOne({
        where: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      })
    ) {
      throw new ConflictException();
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const result = {
      ...createUserDto,
      password: hashedPassword,
    };

    const user = this.usersRepository.create(result);
    return this.usersRepository.save(user);
  }

  async findOne(query: FindOptionsWhere<User>): Promise<User | null> {
    return this.usersRepository.findOne({
      where: query,
    });
  }

  async find(query: FindOptionsWhere<User>): Promise<User[]> {
    return this.usersRepository.find({
      where: query,
    });
  }

  async findUserWishes(username: string): Promise<Wish[]> {
    const user = await this.usersRepository.findOne({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException();
    }

    return this.wishesService.find({ owner: { id: user.id } }, 100, {});
  }

  async updateOne(
    query: FindOptionsWhere<User>,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    const user = await this.findOne(query);
    if (!user) {
      throw new NotFoundException();
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string) {
    const user = await this.findOne({ email });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findById(id: number) {
    const user = await this.findOne({ id });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findByUsername(username: string) {
    const user = await this.findOne({ username });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async removeOne(query: FindOptionsWhere<User>) {
    const user = await this.findOne(query);
    if (!user) {
      throw new NotFoundException();
    }

    await this.usersRepository.remove(user);
  }

  async findByEmailOrUsername(usernameOrEmail: string) {
    return this.usersRepository.find({
      where: [
        { email: ILike(`%${usernameOrEmail}%`) },
        { username: ILike(`%${usernameOrEmail}%`) },
      ],
    });
  }
}
