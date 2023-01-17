import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class EmailDto {
  @ApiProperty({ type: String })
  @IsEmail()
  @IsNotEmpty()
  @Matches(
    '(?!test.@example.com|example@example.com|test@test.com)^[A-Za-z0-9._%+-]+@?(gmail|hotmail|live|outlook|).?(com|net)$'
  )
  email_address: string;
}
