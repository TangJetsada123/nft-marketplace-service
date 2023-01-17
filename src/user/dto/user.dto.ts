import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { BaseSchema } from '../../common/base.schema';
import { BaseDto } from '../../common/base.dto';
import { DATE } from '../../components/enum';

export class UserDto extends BaseSchema {
  @IsOptional()
  @ApiProperty({ required: false })
  username?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  profile_url?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  banner_url?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  bio?: string;

  @ApiProperty({ type: String })
  @IsEmail()
  @IsNotEmpty()
  @Matches(
    '(?!test.@example.com|example@example.com|test@test.com)^[A-Za-z0-9._%+-]+@?(gmail|hotmail|live|outlook|).?(com|net)$'
  )
  email_address?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  total_balance?: number;

  @IsOptional()
  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  status_ban: boolean;
}

export class UpdateUserDto extends PartialType(UserDto) {}

export class StatusDto {
  @ApiProperty()
  status_ban?: boolean;
}

export class UserTokenDto extends PartialType(UserDto) {}

export class QueryDto extends BaseDto {
  @ApiProperty({ required: false })
  username: string;
}

export class QueryDateDto {
  @ApiProperty()
  type: DATE;
}
