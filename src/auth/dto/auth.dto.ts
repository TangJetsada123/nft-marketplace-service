import { ApiProperty } from '@nestjs/swagger';

export class addressDto {
  @ApiProperty()
  readonly address: string;
}

export class createUserDto {
  @ApiProperty()
  readonly password: string;
}

export class signatureInfo {

  @ApiProperty()
  readonly address: string;

  @ApiProperty()
  readonly privateKey: string;

  @ApiProperty()
  readonly signature: string;

}