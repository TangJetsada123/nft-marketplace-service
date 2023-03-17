import {
  Body,
  Controller,
  Get,
  Param,
  UploadedFiles,
  UseInterceptors,
  Put,
  Query,
  Post,
  UseGuards,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { StatusDto, UpdateUserDto, UserDto } from '../dto/user.dto';
import { UserService } from '../service/user.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import 'multer';
import { UploadService } from '../../upload/upload.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { QueryDto } from '../dto/user.dto';
import { EmailDto } from '../../email/email.dto';
import { EmailService } from '../../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AssetService } from '../../asset/asset.service';
import { OfferService } from '../../offer/offer.service';
import { CurrentAdmin } from '../../auth/decorator/admin.decorator';
import { DATE, STATUS } from '../../components/enum';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { OfferDto } from '../../offer/dto/offer.dto';
import { RolesGuard } from '../../auth/guard/role.guard';
import { Roles } from '../../auth/decorator/roles.decorator';
import { Role } from '../../components/enum';
import { Multer } from 'multer';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private uploadService: UploadService,
    private emailService: EmailService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private assetService: AssetService,
    private offerService: OfferService
  ) {}

  @Get()
  async list(@Query() query: QueryDto) {
    let sortby: string;
    if (query.sort) {
      sortby = JSON.parse(query.sort);
    }
    const { data, total } = await this.userService.find(query, sortby);
    return {
      total,
      pagenumber: query.page ?? 1,
      last_page: Math.ceil(total / query.limit),
      data,
    };
  }

  @ApiQuery({ name: 'type', enum: DATE })
  @Get('dashboard')
  groupDate(@Query('type') query: DATE) {
    return this.userService.listDashboard(query);
  }

  @Get('info/:address')
  getInfoByAddress(@Param('address') address: string) {
    return this.userService.findAddressOrCreate(address);
  }

  
  @Get('/:id')
  getInfoById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Put('update/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profile_url', maxCount: 1 },
      { name: 'banner_url', maxCount: 1 },
    ])
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'upload',
    type: UpdateUserDto,
  })
  async update(
    @UploadedFiles()
    files: {
      profile_url?: Express.Multer.File[];
      banner_url?: Express.Multer.File[];
    },
    @Param('id') id: string,
    @Body() dto: UpdateUserDto
  ) {
    if (files['profile_url']) {
      const profileImg = await this.uploadService.upload(
        files['profile_url'][0]
      );
      dto.profile_url = profileImg;
    }
    if (files['banner_url']) {
      const bannerImg = await this.uploadService.upload(files['banner_url'][0]);
      dto.banner_url = bannerImg;
    }
    return this.userService.update(id, dto);
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Put('status/:id')
  async ban(@Param('id') id: string, @Body() dto: StatusDto) {
    const data = {
      ...dto,
      status: dto.status_ban,
    };
    return this.userService.updateStatus(id, data);
  }

  @Roles(Role.USER)
  @UseGuards(RolesGuard, JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Post('email/verify')
  async verifyEmail(@CurrentAdmin() user: UserDto, @Body() payload: EmailDto) {
    const userId = user._id.valueOf();
    const email = payload.email_address;
    await this.userService.updateEmail(userId.toString(), email);
    const token = await this.jwtService.sign(
      { user, email },
      { secret: this.configService.get('authen.secret') }
    );
    return this.emailService.verify(email, token);
  }

  @Get('email/confirm-email/:token')
  async confirmEmail(@Param('token') token: string) {
    const decodeToken = await this.jwtService.verify(token);
    const addressDecode = decodeToken.user._id;
    return this.userService.verifyEmail(addressDecode);
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  @Post('offer/:id')
  async offerAsset(@Param('id') id: string, @Body() dto: OfferDto) {
    const assetId = id.toString();
    const asset = await this.assetService.findById(id);
    const userId = asset.user_id.toString();
    const user = await this.userService.findById(userId);
    const email = user.email_address;
    const offerExpire = new Date(dto.expire_date);
    const checkDuration = await this.offerService.getDuration(
      new Date(),
      offerExpire
    );
    const price = dto.offer_price;
    const token = this.jwtService.sign(
      {
        id,
        offerExpire,
        userId,
        price,
        assetId,
      },
      {
        secret: this.configService.get('authen.secret'),
        expiresIn: checkDuration,
      }
    );
    const emailNotify = await this.emailService.offerNotify(
      email,
      assetId,
      price,
      userId,
      offerExpire,
      token
    );
    return emailNotify;
  }

  @Post('offer/confirm/:token')
  async confirm(@Param('token') token: string) {
    try {
      const decodeToken = await this.jwtService.verify(token);
      const userId = decodeToken.userId;
      const data = {
        status: STATUS.OWNED,
        sell_status: true,
        user_id: userId,
        price: decodeToken.price,
      };
      return this.assetService.update(decodeToken.id, data);
    } catch (error) {
      throw new NotFoundException('Token is Invalid');
    }
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
