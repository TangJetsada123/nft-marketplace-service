import { registerAs } from '@nestjs/config';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { validateData } from './configuration';

export interface INodeMailConfig {
  transport: string;
  from: string;
}

export class NodeMail {
  @Expose({ name: 'TRANSPORT' })
  @IsNotEmpty()
  transport: string;

  @Expose({ name: 'FROM' })
  @IsNotEmpty()
  from: string;
}

export default registerAs('nodemail', async () => {
  const data = Object(await validateData(NodeMail));
  const config = {
    transport: data.transport,
    from: data.from,
    dir_path: './assets/email/template',
  };
  return config;
});
