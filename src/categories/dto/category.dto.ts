import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../common/base.dto';

export class categoryDto {
  @ApiProperty({
    type: String,
    description: 'Category Name',
  })
  category_name: string;
}

export class QueryDto extends BaseDto {
  @ApiProperty({ required: false })
  category_name: string;

  @ApiProperty({ required: false })
  isDeleted: boolean;
}

export class QueryDataDto {
  categoryName?: { $regex: string; $options: string };
  isDeleted?: boolean;
}
