import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsUrl,
  Length,
  Min,
} from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', length: 250 })
  @Length(1, 250)
  name: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsUrl()
  link: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsUrl()
  image: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  @IsNumber()
  @Min(0)
  price: number;

  /** Сумма, которую уже готовы собрать (до сотых) */
  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  @IsNumber()
  @Min(0)
  raised: number;

  /** Описание 1‑1024 символа */
  @Column({ type: 'varchar', length: 1024 })
  @Length(1, 1024)
  description: string;

  /** Заявки на «скинуться» */
  @OneToMany(() => Offer, (offer) => offer.item, { cascade: true })
  offers: Offer[];

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlists: Wishlist[];

  @ManyToOne(() => User, (user) => user.wishes, { onDelete: 'CASCADE' })
  owner: User;

  /** Сколько раз подарок скопировали к себе */
  @Column({ type: 'int', default: 0 })
  @IsInt()
  @Min(0)
  copied: number;
}
