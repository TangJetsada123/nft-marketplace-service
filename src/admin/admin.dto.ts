import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class AdminDto {
  @IsNotEmpty()
  @MaxLength(16, {
    message: 'Username is 16 characters long at max',
  })
  @ApiProperty()
  username?: string;

  @IsNotEmpty()
  @MaxLength(16, { message: 'Password is 16 characters long at max' })
  @ApiProperty()
  password?: string;
}

export class AdminCommandDto extends PartialType(AdminDto) {}
