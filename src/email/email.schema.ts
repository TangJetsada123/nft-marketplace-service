import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from '../common/base.schema';

export type EmailDocument = EmailData & Document;

@Schema({ timestamps: true })
export class EmailData extends BaseSchema {
  @Prop()
  email_address: string;
}

export const EmailSchema = SchemaFactory.createForClass(EmailData);
