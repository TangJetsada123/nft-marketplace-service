import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CollectionDto, QueryDto } from '../dto/collection.dto';
import { CollectionService } from '../services//collection.service';
import 'multer';
import { UploadService } from '../../upload/upload.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { DATE, Role } from '../../components/enum';
import { Roles } from '../../auth/decorator/roles.decorator';
import { RolesGuard } from '../../auth/guard/role.guard';

@ApiTags('Collection')
@Controller('collection')
export class CollectionController {
  constructor(
    private collectionService: CollectionService,
    private uploadService: UploadService
  ) {}

  @Get()
  async findAll(@Query() query: QueryDto) {
    let sortby: string;
    if (query.sort) {
      sortby = JSON.parse(query.sort);
    }
    const { data, total } = await this.collectionService.find(query, sortby);

    return {
      total,
      pagenumber: query.page ?? 1,
      last_page: Math.ceil(total / query.limit),
      data,
    };
  }

  @ApiQuery({ name: 'type', enum: DATE })
  @Get('dashboard')
  lishDashboard(@Query() query: DATE) {
    return this.collectionService.listDashboard(query);
  }

  @Get(':id')
  findByID(@Param('id') id: string) {
    return this.collectionService.findById(id);
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Post('create')
  @ApiCreatedResponse({ description: 'Create New Collection' })
  @ApiBody({ type: CollectionDto })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logoimg', maxCount: 1 },
      { name: 'featuredimg', maxCount: 1 },
      { name: 'bannerimg', maxCount: 1 },
    ])
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of Collection',
    type: CollectionDto,
  })
  async create(
    @UploadedFiles()
    files: {
      logoimg?: Express.Multer.File[];
      featuredimg?: Express.Multer.File[];
      bannerimg?: Express.Multer.File[];
    },
    @Body() dto: CollectionDto
  ) {
    if (files['logoimg']) {
      const logoimg = await this.uploadService.upload(files['logoimg'][0]);
      dto.logo_path = logoimg;
    }
    if (files['featuredimg']) {
      const featuredimg = await this.uploadService.upload(
        files['featuredimg'][0]
      );
      dto.featured_path = featuredimg;
    }
    if (files['bannerimg']) {
      const bannerimg = await this.uploadService.upload(files['bannerimg'][0]);
      dto.banner_path = bannerimg;
    }
    return this.collectionService.create(dto);
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Put('update/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logoimg', maxCount: 1 },
      { name: 'featuredimg', maxCount: 1 },
      { name: 'bannerimg', maxCount: 1 },
    ])
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of Collection',
    type: CollectionDto,
  })
  async update(
    @UploadedFiles()
    files: {
      logoimg?: Express.Multer.File[];
      featuredimg?: Express.Multer.File[];
      bannerimg?: Express.Multer.File[];
    },
    @Param('id') id: string,
    @Body() dto: CollectionDto
  ) {
    if (files['logoimg']) {
      const logoimg = await this.uploadService.upload(files['logoimg'][0]);
      dto.logo_path = logoimg;
    }
    if (files['featuredimg']) {
      const featuredimg = await this.uploadService.upload(
        files['featuredimg'][0]
      );
      dto.featured_path = featuredimg;
    }
    if (files['bannerimg']) {
      const bannerimg = await this.uploadService.upload(files['bannerimg'][0]);
      dto.banner_path = bannerimg;
    }
    return this.collectionService.update(id, dto);
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Delete('delete/:id')
  deleted(@Param('id') id: string) {
    return this.collectionService.delete(id);
  }
}
