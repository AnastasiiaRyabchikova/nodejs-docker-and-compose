import { IsNumber, IsOptional, IsUrl, Length, Min } from 'class-validator';

export class UpdateWishDto {
  @IsOptional()
  @Length(1, 250)
  name?: string;

  @IsOptional()
  @IsUrl()
  link?: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @Length(1, 1024)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  copied?: number;
}
