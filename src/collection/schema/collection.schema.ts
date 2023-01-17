import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CategoryData } from '../../categories/schema/category.schema';
import { BaseSchema } from '../../common/base.schema';
import { UserData } from '../../user/schema/user.schema';

export type CollectionDocument = CollectionData & Document;

@Schema({ timestamps: true })
export class CollectionData extends BaseSchema {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  logo_path: string;

  @Prop()
  featured_path: string;

  @Prop()
  banner_path: string;

  @Prop({ type: Types.ObjectId, ref: 'UserData' })
  user_id: UserData | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'UserData' })
  category_id: CategoryData | Types.ObjectId;
}

export const CollectionSchema = SchemaFactory.createForClass(CollectionData);
