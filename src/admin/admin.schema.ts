import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from '../common/base.schema';

export type AdminDocument = AdminData & Document;

@Schema({ timestamps: true })
export class AdminData extends BaseSchema {
  @Prop()
  username?: string;

  @Prop()
  password?: string;
}

export const AdminSchema = SchemaFactory.createForClass(AdminData);
