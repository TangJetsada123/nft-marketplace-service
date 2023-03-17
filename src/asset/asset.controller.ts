import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../upload/upload.service';
import { AssetService } from './asset.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  AssetDto,
  BanAssetDto,
  BuyAssetDto,
  CreateAssetDto,
  CurrentDto,
  QueryDto,
  SellAssetDto,
} from './dto/asset.dto';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/service/user.service';
import { AssetDecorator } from './decorator/asset.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { DATE, Role, STATUS } from '../components/enum';
import { LogService } from '../log/log.service';
import { RealIP } from 'nestjs-real-ip';
import { CurrentAdmin } from '../auth/decorator/admin.decorator';
import { RolesGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtService } from '@nestjs/jwt';

@ApiTags('asset')
@Controller('asset')
export class AssetController {
  constructor(
    private assetService: AssetService,
    private uploadService: UploadService,
    private emailService: EmailService,
    private userService: UserService,
    private logService: LogService,
    private jwtService: JwtService
  ) { }

  @ApiQuery({ name: 'type', enum: DATE })
  @Get('/dashboard')
  listDashboard(@Query('type') query: DATE) {
    return this.assetService.listDashboard(query);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @ApiQuery({ name: 'type', enum: DATE })
  @Get('/summary')
  async sumView(@CurrentAdmin() user: CurrentDto, @Query('type') type: DATE) {
    const data = await this.logService.groupDate(type);
    const emailData = await this.emailService.sendSummaryView(
      data,
      user.email_address
    );

    return emailData;
  }

  @Get('/findUser/:_id')
  async findByUserId(@Param('_id') userId: string) {
    return await this.assetService.findByUser(userId)
  }

  @Get('/findByColection/:_id')
  async findCollectionId(@Param('_id') collectionId: string) {
    return await this.assetService.findByCollection(collectionId)
  }

  @Get('/')
  async list(@Query() query: QueryDto) {
    let sortby = '';
    if (query.sort) {
      sortby = JSON.parse(query.sort);
    }
    const { data, total } = await this.assetService.find(query, sortby);
    return {
      total,
      pagenumber: query.page ?? 1,
      last_page: Math.ceil(total / query.limit),
      data,
    };
  }

  @Get('/:id')
  async findByid(@Param('id') id: string, @RealIP() ip: string) {
    const asset = await this.assetService.findById(id);
    if (!asset) {
      throw new NotFoundException();
    }
    await this.logService.addView(id, ip);
    return asset;
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateAssetDto })
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateAssetDto
  ) {
    const image = await this.uploadService.upload(file);
    dto.image = image;
    dto.status_ban === false;
    dto.status = STATUS.OWNED;
    return this.assetService.create({ ...dto });
  }

  @Put('/update/:id')
  update(@Param('id') id: string, @Body() dto: AssetDto) {
    return this.assetService.update(id, dto)
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.USER)
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Put('/sell/:id')
  async sell(@Param('id') id: string, @Body() dto: SellAssetDto) {
    const data = {
      ...dto,
      price: dto.price,
      status: STATUS.ONSALE,
    };
    return this.assetService.updateSell(id, data);
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/buy/:id')
  async buy(
    @AssetDecorator() token,
    @Param('id') id: string,
    @Body() dto: BuyAssetDto
  ) {
    const checkConfirm = dto.confirm;
    const data = {
      sell_status: true,
      status: STATUS.OWNED,
      user_id: token._id.toString(),
    };
    const userData = await this.userService.findById(token._id)
    const totalBalance = userData.total_balance
    console.log(userData.total_balance)
    console.log(dto.price)
    const total = totalBalance - dto.price
    console.log(total)
    if (checkConfirm === true) {  
        if(Number(userData.total_balance) >= Number(dto.price)){
        await this.assetService.update(id, data);
        return await this.userService.update(token._id, {
          total_balance: Number(totalBalance - dto.price)
        })
      }else{
        throw new Error(' please add more fund');
      }
    } else {
      throw new Error(' transaction is error');
    }
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Put('/statusBan/:id')
  async ban(@Param('id') id: string, @Body() status: BanAssetDto) {
    const asset = await this.assetService.findById(id);
    const user = await this.userService.findById(asset.user_id.toString());
    if (asset.status_ban == false) {
      await this.assetService.updateStatus(id, status);
      const emailNotify = await this.emailService.banNotify(
        user.email_address,
        id
      );
      return emailNotify;
    } else {
      return await this.assetService.updateStatus(id, status);
    }
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Delete('delete/:id')
  softDeleted(@Param('id') id: string) {
    return this.assetService.softDeleted(id);
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Put('restore/:id')
  restore(@Param('id') id: string) {
    return this.assetService.restore(id);
  }
}
