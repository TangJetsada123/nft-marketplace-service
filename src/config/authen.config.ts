import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { validateData } from './configuration';

export interface IAuthenConfig {
  secret: string;
  expiresIn: string;
}

export class Authen {
  @Expose({ name: 'SECRET' })
  @IsString()
  @IsNotEmpty()
  secret: string;

  @Expose({ name: 'EXPIRES_IN' })
  @IsString()
  expires_In: string;
}

export default registerAs('authen', async () => {
  const data = Object(await validateData(Authen));
  const config = {
    secret: data.secret,
    expires_In: data.expires_In,
  };
  return config;
});
