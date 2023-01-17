import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../../auth/auth.module';
import { UploadModule } from '../../upload/upload.module';
import { UploadService } from '../../upload/upload.service';
import { CollectionController } from '../controllers/collection.controller';
import { CollectionData, CollectionSchema } from '../schema/collection.schema';
import { CollectionService } from '../services/collection.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CollectionData.name, schema: CollectionSchema },
    ]),
    UploadModule,
    AuthModule,
  ],
  controllers: [CollectionController],
  providers: [CollectionService, UploadService],
  exports: [CollectionService],
})
export class CollectionModule {}
