import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { AdminCommand } from './admin/admin.command';
@Module({
  imports: [CommandModule],
  providers: [AdminCommand],
})
export class TestModule {}
