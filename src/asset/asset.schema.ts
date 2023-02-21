import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { CategoryData } from '../categories/schema/category.schema';
import { CollectionData } from '../collection/schema/collection.schema';
import { BaseSchema } from '../common/base.schema';
import { UserData } from '../user/schema/user.schema';
import { STATUS } from 'src/components/enum';

export type AssetDocument = AssetData & Document;

@Schema({ timestamps: true })
export class AssetData extends BaseSchema {
  @Prop()
  name?: string;

  @Prop()
  blockchain?: string;

  @Prop()
  image?: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'CategoryData' })
  category_id: CategoryData | Types.ObjectId;

  @Prop()
  price?: number;

  @Prop()
  sell_status?: boolean;

  @Prop({ type: Types.ObjectId, ref: 'CollectionData' })
  collection_id: CollectionData | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'UserData' })
  user_id: UserData | Types.ObjectId;

  @Prop()
  status_ban: boolean;

  @Prop()
  status: STATUS;
}
export const AssetSchema =
  SchemaFactory.createForClass(AssetData).plugin(softDeletePlugin);
