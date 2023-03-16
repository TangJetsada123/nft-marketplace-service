import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';
import { BaseDto } from '../../common/base.dto';
import { STATUS } from '../../components/enum';

export class AssetDto {
  @IsOptional()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsOptional()
  @ApiProperty()
  blockchain?: string;

  @IsOptional()
  @ApiProperty()
  image?: string;

  @IsOptional()
  @ApiProperty()
  collection_id?: string;

  @IsOptional()
  @ApiProperty()
  category_id?: string;

  @IsOptional()
  @ApiProperty()
  price?: number;

  @IsOptional()
  @ApiProperty()
  sell_status?: boolean;

  @IsOptional()
  @ApiProperty()
  user_id?: string;

  @IsOptional()
  @ApiProperty()
  confirm?: boolean;

  @IsOptional()
  @ApiProperty()
  status: string;
}

export class BanAssetDto {
  @ApiProperty()
  @IsNotEmpty()
  @ApiProperty()
  status_ban: boolean;
}

export class BuyAssetDto {
  @ApiProperty()
  @IsNotEmpty()
  confirm: boolean;

  @IsOptional()
  @ApiProperty()
  price?: number;

}

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

  status: STATUS;
}

export class CurrentDto {
  @ApiProperty()
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  profile_Url: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  isVerified: boolean;

  @ApiProperty()
  @IsNotEmpty()
  status_ban: boolean;

  @ApiProperty()
  @IsNotEmpty()
  email_address: string;
}

export class QueryDto extends BaseDto {
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  category_id: string;

  @ApiProperty({ required: false })
  collection_id: string;

  @ApiProperty({ required: false })
  user_id: string;

  @ApiProperty({ required: false, enum: STATUS })
  status: STATUS;

  @ApiProperty({ required: false })
  isDeleted: boolean;
}

export class SellAssetDto {
  @ApiProperty()
  @IsNotEmpty()
  price?: number;
}
export class QueryDataDto {
  category_id?: string;
  collection_id?: string;
  user_id?: string;
  name?: { $regex: string; $options: string };
  isDeleted?: boolean;
  status?: STATUS;
}
