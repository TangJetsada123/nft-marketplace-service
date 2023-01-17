import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class OfferService {
  async getDuration(currentDate: Date, offerExpire: Date) {
    if (offerExpire.getTime() < currentDate.getTime()) {
      throw new BadRequestException('Token is Expired');
    }
    return Math.floor((offerExpire.getTime() - currentDate.getTime()) / 1000);
  }
}
