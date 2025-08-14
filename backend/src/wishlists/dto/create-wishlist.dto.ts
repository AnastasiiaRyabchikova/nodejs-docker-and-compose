import { Length, IsOptional, IsUrl, IsArray, IsNumber } from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';

export class CreateWishlistDto {
  @Length(1, 250)
  name: string;

  @IsOptional()
  @Length(0, 1500)
  description?: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  itemsId: Wish[];
}
