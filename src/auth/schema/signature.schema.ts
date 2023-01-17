import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from '../../common/base.schema';

export type SignatureDocument = SignatureData & Document;

@Schema({ timestamps: true })
export class SignatureData extends BaseSchema {
  @Prop()
  password: string;

  @Prop()
  privateKey: string;

  @Prop()
  address: string;

  @Prop()
  signature: string;
}
export const SignatureSchema = SchemaFactory.createForClass(SignatureData);
