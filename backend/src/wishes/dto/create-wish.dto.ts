import { IsNumber, IsOptional, IsUrl, Length, Min } from 'class-validator';

export class CreateWishDto {
  @Length(1, 250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @Length(1, 1024)
  description?: string;
}
