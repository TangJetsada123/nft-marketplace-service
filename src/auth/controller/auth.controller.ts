import {
  Controller,
  Body,
  Post,
  Get,
  UseGuards,
  UnauthorizedException,
  Query,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { signatureDto } from '../dto/signature.dto';
import { AuthService } from '../service/auth.service';
import { AdminDto } from '../../admin/admin.dto';
import { CurrentAdmin } from '../decorator/admin.decorator';
import { UserService } from '../../user/service/user.service';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { AdminService } from '../../admin/admin.service';
import { Role } from '../../components/enum';
import { createUserDto } from '../dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UserService,
    private adminService: AdminService,
    private jwtService: JwtService
  ) { }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentAdmin() admin: AdminDto) {
    return admin;
  }

  @Post('create')
  create(@Body() user: createUserDto) {
    return this.authService.createUser(user.username, user.password)
  }

  @Post('/login/')
  async generateJwt(@Body() userData) {
    console.log(userData)
    const data = await this.authService.findAddress(userData.username)
    if (data && data.password == userData.password) {
      const address = await this.authService.recoverAddress(data);
      if (!address) {
        throw new UnauthorizedException('Address not found ');
      }
      const user = await this.usersService.findAddressOrCreate(address);
      if (!user || user.status_ban) {
        throw new UnauthorizedException(
          'User not found or user has already banned  '
        );
      }
      return this.authService.generateJwtToken(user, Role.USER);
    }else{
      throw new UnauthorizedException(
        'User not found or user has already banned  '
      )
    }

  }

  @Post('login/admin')
  async login(@Body() payload: AdminDto) {
    const admin = await this.adminService.findAdmin(payload.username);
    if (!admin) {
      throw new UnauthorizedException('Admin not found ');
    }
    const isValid = await this.authService.verifyPassword(
      payload.password,
      admin.password
    );
    if (!isValid) {
      throw new UnauthorizedException('Incorrect password ');
    }
    return this.authService.generateJwtToken(admin, Role.ADMIN);
  }
}
