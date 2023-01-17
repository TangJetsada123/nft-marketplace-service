import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/service/user.service';
import { ConfigService } from '@nestjs/config';
import { AdminService } from '../../admin/admin.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private userService: UserService,
    private adminService: AdminService,
    configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('authen.secret'),
    });
  }

  async validate(payload) {
    const admin = await this.adminService.findById(payload.sub);
    if (admin) {
      return admin;
    }

    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new BadRequestException();
    }

    if (user.status_ban) {
      throw new UnauthorizedException('User has already banned ');
    }
    return user;
  }
}
