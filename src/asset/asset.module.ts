import { forwardRef, Module } from '@nestjs/common';
import { AssetController } from './asset.controller';
import { AssetData, AssetSchema } from './asset.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadService } from '../upload/upload.service';
import { AssetService } from './asset.service';
import { UserModule } from '../user/user.module';
import { EmailModule } from '../email/email.module';
import { LogModule } from '../log/log.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AssetData.name, schema: AssetSchema }]),
    EmailModule,
    LogModule,
    forwardRef(() => UserModule),
    AuthModule,
  ],
  controllers: [AssetController],
  providers: [AssetService, UploadService],
  exports: [AssetService],
})
export class AssetModule {}
