import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAssetDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  blockchain: string;

  @ApiProperty({ type: String, format: 'binary' })
  file: Express.Multer.File;

  image: string;

  @ApiProperty()
  @IsNotEmpty()
  collection_id: string;

  @ApiProperty()
  @IsNotEmpty()
  category_id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  sell_status: boolean;

  @ApiProperty()
  status_ban: boolean;
}
