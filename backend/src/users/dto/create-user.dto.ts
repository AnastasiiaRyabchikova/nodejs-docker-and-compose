import { IsEmail, IsString, IsOptional, Length } from 'class-validator';

export class CreateUserDto {
  @Length(2, 20)
  @IsString()
  username: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  about?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
