import { IsString, Length } from 'class-validator';

export class SigninDto {
  @Length(2, 20)
  @IsString()
  username: string;

  @IsString()
  password: string;
}
