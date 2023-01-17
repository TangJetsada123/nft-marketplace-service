import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogData, LogSchema } from './log.schema';
import { LogService } from './log.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LogData.name, schema: LogSchema }]),
  ],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
