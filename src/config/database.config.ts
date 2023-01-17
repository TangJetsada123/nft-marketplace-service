import { registerAs } from '@nestjs/config';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { validateData } from './configuration';

export interface IDataConfig {
  mongo_uri: string;
}

export class Database {
  @Expose({ name: 'MONGO_URI' })
  @IsString()
  @IsNotEmpty()
  mongo_uri: string;
}

export default registerAs('database', async () => {
  const data = Object(await validateData(Database));
  const config = {
    mongo_uri: data.mongo_uri,
  };
  return config;
});
