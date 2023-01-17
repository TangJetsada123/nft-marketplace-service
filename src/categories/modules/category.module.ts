import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../../auth/auth.module';
import { UploadService } from '../../upload/upload.service';
import { CategoryController } from '../controllers/category.controller';
import { CategoryData, CategorySchema } from '../schema/category.schema';
import { CategoryService } from '../services/category.service';
@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: CategoryData.name, schema: CategorySchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, UploadService],
  exports: [CategoryService],
})
export class CategoryModule {}
