import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserData, UserSchema } from './schema/user.schema';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UploadService } from '../upload/upload.service';
import { AssetModule } from '../asset/asset.module';
import { EmailModule } from '../email/email.module';
import { OfferModule } from '../offer/offer.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserData.name, schema: UserSchema }]),
    forwardRef(() => AssetModule),
    AuthModule,
    EmailModule,
    OfferModule,
  ],
  providers: [UserService, UploadService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
