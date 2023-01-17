import { ApiProperty } from '@nestjs/swagger';
export class signatureDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  signature: string;
}

export class signMessageDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  privateKey: string;
}
