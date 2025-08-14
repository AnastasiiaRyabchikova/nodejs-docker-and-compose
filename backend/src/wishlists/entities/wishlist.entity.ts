import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { Length, IsOptional, IsUrl } from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', length: 250 })
  @Length(1, 250)
  name: string;

  @Column({ type: 'varchar', length: 1500, nullable: true })
  @IsOptional()
  @Length(0, 1500)
  description?: string;

  /** Обложка‑URL (опционально) */
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsUrl()
  image?: string;

  @ManyToMany(() => Wish, (wish) => wish.wishlists)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishes, { onDelete: 'CASCADE' })
  owner: User;
}
