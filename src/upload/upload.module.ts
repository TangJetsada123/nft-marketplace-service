import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Module({
  imports: [MulterModule, ConfigModule],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
