import { IsEmail, IsString, IsOptional, Length } from 'class-validator';

export class UpdateUserDto {
  @Length(2, 20)
  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  about?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
