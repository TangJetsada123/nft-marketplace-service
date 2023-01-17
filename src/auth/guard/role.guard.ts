import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../../components/enum';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const token = await context
      .switchToHttp()
      .getRequest()
      .headers.authorization.split(' ');
    const user = this.jwtService.verify(token[1]);
    const checkRole = requiredRoles.some((role) => user.role?.includes(role));
    if (!checkRole) {
      throw new UnauthorizedException();
    }
    return checkRole;
  }
}
