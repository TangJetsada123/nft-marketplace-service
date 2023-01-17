import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from '../../common/base.schema';

export type UserDocument = UserData & Document;

@Schema({ timestamps: true })
export class UserData extends BaseSchema {
  @Prop()
  username: string;

  @Prop()
  profile_url: string;

  @Prop()
  banner_url: string;

  @Prop()
  bio: string;

  @Prop()
  email_address: string;

  @Prop()
  total_balance: number;

  @Prop()
  address: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  status_ban: boolean;
}
export const UserSchema = SchemaFactory.createForClass(UserData);
