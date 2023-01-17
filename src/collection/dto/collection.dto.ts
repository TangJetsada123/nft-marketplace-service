import { BaseDto } from '../../common/base.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CollectionDto {
  @ApiProperty({ type: String, description: 'Collection Name' })
  name: string;

  @ApiProperty({ type: String, description: 'Detail' })
  description: string;

  logo_path: string;

  featured_path: string;

  banner_path: string;

  @ApiProperty({ type: String, description: 'ID User' })
  user_id: string;

  @ApiProperty({ type: String, format: 'binary' })
  logoimg: Express.Multer.File[];

  @ApiProperty({ type: String, format: 'binary' })
  featuredimg: Express.Multer.File[];

  @ApiProperty({ type: String, format: 'binary' })
  bannerimg: Express.Multer.File[];
}

export class QueryCollectionDto extends BaseDto {
  @ApiProperty({ required: false })
  name: string;
}

export class QueryDto extends BaseDto {
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  user_id: string;
}

export class QueryDataDto {
  name?: { $regex: string; $options: string };
  user_id?: string;
}
