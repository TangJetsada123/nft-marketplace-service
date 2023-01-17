import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetModule } from './asset/asset.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoryModule } from './categories/modules/category.module';
import { CollectionModule } from './collection/modules/collection.module';
import { UploadModule } from './upload/upload.module';
import { AdminModule } from './admin/admin.module';
import { CommandModule } from 'nestjs-command';
import { EmailModule } from './email/email.module';
import authenConfig from './config/authen.config';
import emailConfig from './config/email.config';
import uploadConfig from './config/upload.config';
import { OfferModule } from './offer/offer.module';
import { LogModule } from './log/log.module';
import databaseConfig from './config/database.config';
import nodemailConfig from './config/nodemail.config';
import { AdminCommand } from './admin/admin.command';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        authenConfig,
        emailConfig,
        uploadConfig,
        nodemailConfig,
      ],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('database.mongo_uri'),
      }),
      inject: [ConfigService],
    }),
    CategoryModule,
    CollectionModule,
    ConfigModule,
    AssetModule,
    UploadModule,
    UserModule,
    CommandModule,
    AdminModule,
    EmailModule,
    OfferModule,
    LogModule,
  ],
  providers: [AdminCommand],
})
export class AppModule {}
