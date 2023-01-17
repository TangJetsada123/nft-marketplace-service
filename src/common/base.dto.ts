import { ApiProperty } from '@nestjs/swagger';
import { DATE } from '../components/enum';

export class BaseDto {
  @ApiProperty({ required: false })
  limit: number;

  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  sort: string;
}

export class QueryTypeDto {
  @ApiProperty({ required: false })
  type: DATE;
}
