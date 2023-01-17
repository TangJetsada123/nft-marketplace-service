import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorator/roles.decorator';
import { RolesGuard } from '../../auth/guard/role.guard';
import { Role } from '../../components/enum';
import { categoryDto, QueryDto } from '../dto/category.dto';
import { CategoryService } from '../services/category.service';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  async findAll(@Query() query: QueryDto) {
    let sortby: string;
    if (query.sort) {
      sortby = JSON.parse(query.sort);
    }
    const { data, total } = await this.categoryService.find(query, sortby);

    return {
      total,
      page: query.page ?? 1,
      last_page: Math.ceil(total / query.limit),
      data,
    };
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post('create')
  @ApiResponse({
    status: 201,
    description: 'The Category has been successfully created.',
  })
  create(@Body() dto: categoryDto) {
    return this.categoryService.create(dto);
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Put('update/:_id')
  update(@Param('_id') id: string, @Body() dto: categoryDto) {
    return this.categoryService.update(id, dto);
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete('delete/:id')
  softDeleted(@Param('id') id: string) {
    return this.categoryService.softDeleted(id);
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Put('restore/:id')
  restore(@Param('id') id: string) {
    return this.categoryService.restore(id);
  }

  @Get(':id')
  findByID(@Param('id') id: string) {
    return this.categoryService.findById(id);
  }
}
