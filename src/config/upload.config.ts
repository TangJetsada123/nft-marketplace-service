import { registerAs } from '@nestjs/config';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { validateData } from './configuration';

export interface IUploadConfig {
  host: string;
  protocol: string;
  upload_path: string;
  ipfs_port: number;
}

export class Upload {
  @Expose({ name: 'HOST' })
  @IsString()
  @IsNotEmpty()
  host: string;

  @Expose({ name: 'PROTOCOL' })
  @IsString()
  @IsNotEmpty()
  protocol: string;

  @Expose({ name: 'UPLOAD_PATH' })
  @IsString()
  @IsNotEmpty()
  upload_path: string;

  @Expose({ name: 'IPFS_PORT' })
  @IsNumberString()
  @IsNotEmpty()
  ipfs_port: string;
}

export default registerAs('upload', async () => {
  const data = Object(await validateData(Upload));
  const config = {
    host: data.host,
    protocol: data.protocol,
    upload_path: data.upload_path,
    ipfs_port: data.ipfs_port,
  };
  return config;
});
