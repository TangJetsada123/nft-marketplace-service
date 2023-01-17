import { ApiProperty } from '@nestjs/swagger';

export class OfferDto {
  @ApiProperty()
  offer_price: number;

  @ApiProperty()
  expire_date: string;
}
