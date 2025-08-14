import { User } from 'src/users/entities/user.entity';

export class UpdateOfferDto {
  user?: User;
  item?: string;
  amount?: number;
  hidden?: boolean;
}
