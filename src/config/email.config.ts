import { registerAs } from '@nestjs/config';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { validateData } from './configuration';

export interface IEmailConfig {
  secret: string;
  url: string;
  sender: string;
  password: string;
  service: string;
  frontendPath: string;
}

export class Email {
  @Expose({ name: 'URL' })
  @IsNotEmpty()
  url: string;

  @Expose({ name: 'SENDER' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  sender: string;

  @Expose({ name: 'SENDER_PASSWORD' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Expose({ name: 'SERVICE' })
  @IsString()
  @IsNotEmpty()
  service: string;

  @Expose({ name: 'FRONTEND_PATH' })
  @IsNotEmpty()
  frontendPath: string;
}
export default registerAs('emailDatabase', async () => {
  const data = Object(await validateData(Email));
  const config = {
    url: data.url,
    sender: data.sender,
    password: data.password,
    service: data.service,
    frontendPath: data.frontendPath,
  };
  return config;
});
