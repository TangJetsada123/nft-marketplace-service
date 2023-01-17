import { Command, Positional } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { AdminService } from './admin.service';

@Injectable()
export class AdminCommand {
  constructor(private readonly adminService: AdminService) {}

  @Command({
    command: 'create:admin <username> <password>',
    describe: 'create admin',
  })
  async create(
    @Positional({
      name: 'username',
      describe: 'the username',
      type: 'string',
    })
    username: string,
    @Positional({
      name: 'password',
      describe: 'the username',
      type: 'string',
    })
    password: string
  ) {
    return this.adminService.create({ username, password });
  }
}
