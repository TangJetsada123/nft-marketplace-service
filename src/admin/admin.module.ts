import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminData, AdminSchema } from './admin.schema';
import { AdminCommand } from './admin.command';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AdminData.name, schema: AdminSchema }]),
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminCommand],
  exports: [AdminService],
})
export class AdminModule {}
