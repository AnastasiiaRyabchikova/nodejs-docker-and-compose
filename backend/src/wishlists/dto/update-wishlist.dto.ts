import { Length, IsOptional, IsUrl, IsArray, IsNumber } from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';

export class UpdateWishlistDto {
  @IsOptional()
  @Length(1, 250)
  name?: string;

  @IsOptional()
  @Length(0, 1500)
  description?: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  itemsId: Wish[];
}
