import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseSchema } from '../common/base.schema';
import { AssetData } from '../asset/asset.schema';

@Schema({ timestamps: true })
export class LogData extends BaseSchema {
  @Prop()
  ip_address: string;

  @Prop({ type: Types.ObjectId, ref: 'AssetData' })
  asset_id: AssetData | Types.ObjectId;
}

export type LogDocument = LogData & Document;
export const LogSchema = SchemaFactory.createForClass(LogData);
