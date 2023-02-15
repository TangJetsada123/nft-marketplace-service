import {
  Controller,
  Body,
  Post,
  Get,
  UseGuards,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { signatureDto } from '../dto/signature.dto';
import { AuthService } from '../service/auth.service';
import { AdminDto} from '../../admin/admin.dto';
import { CurrentAdmin } from '../decorator/admin.decorator';
import { UserService } from '../../user/service/user.service';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { AdminService } from '../../admin/admin.service';
import { Role } from '../../components/enum';
import { createUserDto } from '../dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UserService,
    private adminService: AdminService
  ) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentAdmin() admin: AdminDto) {
    return admin;
  }

  @Post('create')
  create(@Body() password: createUserDto){
    return this.authService.createUser(password.password)
  }

  @Post('signature')
  async findSignature(@Body() password: createUserDto){
    console.log("password",password)
    const userInfo = await this.authService.findAddress(password)
    if(!userInfo){
      throw new UnauthorizedException(
        'User not found or user has already banned  '
      )
    }
    return  this.authService.generateTokenSignature(userInfo);
  }

  @Post('login')
  async generateJwt(@Body() signature: signatureDto) {
    const address = await this.authService.recoverAddress(signature);
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
