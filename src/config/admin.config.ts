import { registerAs } from '@nestjs/config';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { validateData } from './configuration';

export interface IAdminConfig {
  hash: number;
}

export class Admin {
  @Expose({ name: 'HASH' })
  @IsNotEmpty()
  hash: number;
}

export default registerAs('admin', async () => {
  const data = Object(await validateData(Admin));
  const config = {
    hash: data.hash,
  };
  return config;
});
