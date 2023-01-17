import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt-strategy';
import { AuthController } from './controller/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from '../admin/admin.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SignatureData, SignatureSchema } from './schema/signature.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SignatureData.name, schema: SignatureSchema }]),
    forwardRef(() => UserModule),
    AdminModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('authen.secret'),
        signOptions: {
          expiresIn: configService.get('authen.expires_In'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
