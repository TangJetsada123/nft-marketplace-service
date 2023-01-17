import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminDto } from './admin.dto';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}
  @Post('create')
  createAdmin(@Body() admin: AdminDto) {
    return this.adminService.create(admin);
  }

  @Get('list')
  list() {
    return this.adminService.findAll();
  }

  @Get(':id')
  show(@Param('id') id: string) {
    return this.adminService.findById(id);
  }
}
